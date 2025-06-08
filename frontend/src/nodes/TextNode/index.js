import { Position } from 'reactflow';
import { GenericNode } from '../../genericNode';
import { MdTextFields } from 'react-icons/md';

export const TextNode = (props) => (
  <GenericNode
    {...props}
    label="Text"
    icon={<MdTextFields className="w-5 h-5 text-purple-500 mr-2" />}
    fields={[
      { name: 'inputName', label: 'Name', type: 'text', defaultValue: props.data?.inputName || '' },
      { name: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'], defaultValue: props.data?.inputType || 'Text' },
      { name: 'Text', label: 'Text', type: 'textarea', defaultValue: props.data?.output || '' },
    ]}
    description="Provide input data to your workflow. Choose a name and type for this input."
    handles={[
      { type: 'source', position: Position.Right, id: `${props.id}-value` }
    ]}
    onDelete={() => props.data?.onDelete?.(props.id)}
     onVariableReferencesChange={props.data?.onVariableReferencesChange}  
  />
);