import { Position } from 'reactflow';
import { GenericNode } from '../../genericNode';
import { MdOutlineInput } from 'react-icons/md';

export const InputNode = (props) => (
  <GenericNode
    {...props}
    label="Input"
    icon={<MdOutlineInput className="w-5 h-5 text-green-500 mr-2" />}
    fields={[
      { name: 'inputName', label: 'Name', type: 'text', defaultValue: props.data?.inputName || '' },
      { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'], defaultValue: props.data?.inputType || 'Text' },
    ]}
    description="Provide input data to your workflow. Choose a name and type for this input."
    handles={[
      { type: 'source', position: Position.Right, id: `${props.id}-value` }
    ]}
    onDelete={() => props.data?.onDelete?.(props.id)}
  />
);