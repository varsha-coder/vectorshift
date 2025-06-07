import { Position } from 'reactflow';
import { GenericNode } from '../../genericNode';

export const MathNode = (props) => (
  <GenericNode
    {...props}
    label="Math"
    fields={[
      { name: 'inputName', label: 'Name', type: 'text', defaultValue: props.data?.inputName || '' },
      { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'], defaultValue: props.data?.inputType || 'Text' },
    ]}
    handles={[
      { type: 'source', position: Position.Right, id: `${props.id}-value` }
    ]}
  />
);