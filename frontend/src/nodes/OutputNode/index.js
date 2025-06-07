import { Position } from 'reactflow';
import { GenericNode } from '../../genericNode';

// Output Node
export const OutputNode = (props) => (
  <GenericNode
    {...props}
    label="Output"
    fields={[
      { name: 'outputName', label: 'Name', type: 'text', defaultValue: props.data?.outputName || 'hello' },
    ]}
    handles={[
      { type: 'target', position: Position.Left, id: `${props.id}-input` }
    ]}
  />
);