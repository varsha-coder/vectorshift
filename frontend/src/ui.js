import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { TextNode } from './nodes/TextNode/index';
import { InputNode } from './nodes/InputNode/index';
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
  setNodes: state.setNodes,
  setEdges: state.setEdges,  // <--- ADD THIS if not present in store
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
    setNodes,
    setEdges,  // <--- ADD THIS
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  // --- Delete node ---
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  // --- Initialize node data ---
  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    nodeData.onDelete = handleDeleteNode;
    return nodeData;
  };

  // --- handle variable reference change ---
 const handleVariableReferencesChange = useCallback((textNodeId, variables) => {
  variables.forEach((varName, idx) => {
    // Check if already exists
    const existingNode = nodes.find(n => n.data?.inputName === varName);

    if (!existingNode) {
      // Find the current TextNode's position
      const textNode = nodes.find(n => n.id === textNodeId);
      const textNodePos = textNode?.position || { x: 200, y: 200 };

      const nodeWidth = 260; // adjust to your node's width
      const minX = 20;
      const minY = 20;
      const offsetX = -nodeWidth - 240; // 120px gap for even more space
      const offsetY = 40 * idx; // stagger if multiple

      const newX = Math.max(textNodePos.x + offsetX, minX);
      const newY = Math.max(textNodePos.y + offsetY, minY);

      // Map variable name → node type
      const varNameLower = varName.toLowerCase();

      const nodeTypeMap = {
        input: 'customInput',
        output: 'customOutput',
        llm: 'llm',
        text: 'text',
        math: 'math',
      };

      const newNodeType = nodeTypeMap[varNameLower] || 'customInput';  // fallback

      const nodeID = getNodeID(newNodeType);

      const newNode = {
        id: nodeID,
        type: newNodeType,
        position: {
          x: newX,
          y: newY,
        },
        data: {
          ...getInitNodeData(nodeID, newNodeType),
          inputName: varName,
        },
      };

      // Add new node
      addNode(newNode);

      // Add edge to TextNode
      const newEdgeId = `e-${newNode.id}-${textNodeId}-var-${varName}`;
      const newEdge = {
        id: newEdgeId,
        source: newNode.id,
        target: textNodeId,
        targetHandle: `var-${varName}`,
        style: {
          stroke: '#444',
          strokeWidth: 1,
          strokeLinecap: 'round',
        },
        markerEnd: {
          type: 'arrowclosed',
          color: '#444',
          width: 0.5,
          height: 0.5,
        },
      };
    
      // Prevent duplicate edges
      const existingEdge = edges.find(e =>
        e.id === newEdgeId ||
        (e.source === newNode.id && e.target === textNodeId && e.targetHandle === `var-${varName}`)
      );

      if (!existingEdge) {
        setEdges(prev => [...prev, newEdge]);
      }
    }
  });
   
}, [nodes, edges, addNode, setEdges, getNodeID, getInitNodeData]);
  // --- onDrop ---
  const onDrop = useCallback((event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    if (event?.dataTransfer?.getData('application/reactflow')) {
      const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const type = appData?.nodeType;

      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      };
      addNode(newNode);
    }
  }, [reactFlowInstance, addNode, getNodeID, handleDeleteNode]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: '100wv', height: '70vh' }}>
        <ReactFlow
          nodes={nodes.map(node => {
            if (node.type === 'text') {
              return {
                ...node,
                data: {
                  ...node.data,
                  onDelete: (id) => {
                    setNodes(prev => prev.filter(n => n.id !== id));
                    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
                  },
                  onVariableReferencesChange: (vars) => handleVariableReferencesChange(node.id, vars),
                },
              };
            }
            return node;
          })}
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
              stroke: '#444',
              strokeWidth: 1,
              strokeLinecap: 'round',
            },
            markerEnd: {
              type: 'arrowclosed',
              color: '#444',
              width: 0.5,
              height: 0.5,
            },
          }}
        >
          <Background color="#aaa" gap={gridSize} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </>
  );
};
