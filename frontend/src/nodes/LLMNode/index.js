import { Position } from 'reactflow';
import { GenericNode } from '../../genericNode';
import { GiArtificialHive } from 'react-icons/gi';

// LLM Node
export const LLMNode = (props) => (
  <GenericNode
    {...props}
    label="LLM"
    icon={<GiArtificialHive className="w-5 h-5 text-orange-500 mr-2" />}
    fields={[
      { name: 'outputName', label: 'Name', type: 'text', defaultValue: props.data?.outputName || '' },
    ]}
    description="Large Language Model node. Accepts system and prompt inputs, returns a response."
    handles={[
      { type: 'target', position: Position.Left, id: `${props.id}-input` , style: { top: '33%' } },
      { type: 'target', position: Position.Left, id: `${props.id}-prompt`, style: { top: '66%' } },
      { type: 'source', position: Position.Right, id: `${props.id}-response` }
    
    ]}
    onDelete={() => props.data?.onDelete?.(props.id)}
  />
);