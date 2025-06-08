import { Position } from 'reactflow';
import { GenericNode } from '../../genericNode';
import { MdFunctions } from 'react-icons/md';

export const MathNode = (props) => (
  <GenericNode
    {...props}
    label="Math"
    icon={<MdFunctions className="w-5 h-5 text-yellow-500 mr-2" />}
    fields={[
      { name: 'inputName', label: 'Name', type: 'text', defaultValue: props.data?.inputName || '' },
      { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'], defaultValue: props.data?.inputType || 'Text' },
    ]}
    description="Perform a mathematical calculation using the provided expression. Use variables like {{input}}."
    handles={[
      { type: 'source', position: Position.Right, id: `${props.id}-value` }
    ]}
    onDelete={() => props.data?.onDelete?.(props.id)}
  />
);