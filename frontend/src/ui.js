import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { TextNode } from './nodes/TextNode/index';
import { InputNode } from './nodes/InputNode/index'
import { OutputNode } from './nodes/OutputNode/index';
import { LLMNode } from './nodes/LLMNode/index';
import { MathNode } from './nodes/MathNode/index';
import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  math: MathNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  setNodes: state.setNodes, // <-- add this if not present
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    setNodes, // <-- add this if not present
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  // --- Add this function ---
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => {
      const filtered = nds.filter((n) => n.id !== nodeId);
      return filtered;
    });
  }, [setNodes]);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    // Pass the delete handler to each node
    nodeData.onDelete = handleDeleteNode;
    return nodeData;
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type), // <-- now includes onDelete
        };
        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode, getNodeID, handleDeleteNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: '100wv', height: '70vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType='smoothstep'
            defaultEdgeOptions={{
  style: {
    stroke: '#444',         // Tailwind blue-600 for a modern look
    strokeWidth: 1,          // Slightly thicker
    strokeLinecap: 'round',    // Rounded ends
  },
  markerEnd: {
    type: 'arrowclosed',       // Arrow at the end
    color: '#444',
    width: .5,
    height: .5,
  }
}}
        >
          <Background color="#aaa" gap={gridSize} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </>
  )
}