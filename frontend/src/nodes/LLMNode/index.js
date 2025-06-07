import { Position } from 'reactflow';
import { GenericNode } from '../../genericNode';
  
// Output Node
export const LLMNode = (props) => (
  <GenericNode
    {...props}
    label="LLM"
    fields={[
      { name: 'outputName', label: 'Name', type: 'text', defaultValue: props.data?.outputName || '' },
    ]}
    handles={[
      { type: 'target', position: Position.Left, id: `${props.id}-input` }
    ]}
  />
);