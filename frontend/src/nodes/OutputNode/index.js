import { Position } from 'reactflow';
import { GenericNode } from '../../genericNode';
import { MdOutlineOutput } from 'react-icons/md';

// Output Node
export const OutputNode = (props) => (
  <GenericNode
    {...props}
    label="Output"
    icon={<MdOutlineOutput className="w-5 h-5 text-blue-500 mr-2" />}
    fields={[
  { name: 'outputName', label: 'Name', type: 'text', defaultValue: props.data?.outputName || '' },
  { name: 'outputType', label: 'Type', type: 'select', options: ['Text', 'Image'], defaultValue: props.data?.outputType || 'Text' },
  { name: 'output', label: 'Output', type: 'textarea', defaultValue: props.data?.output || '' },
]}
    description="Output data of different types from your workflow."
    handles={[
      { type: 'target', position: Position.Left, id: `${props.id}-input` }
    ]}
    showFormatOutput={true}
    formatOutput={props.data?.formatOutput ?? false}
    onFormatChange={props.data?.onFormatChange}
    onDelete={() => props.data?.onDelete?.(props.id)}
  />
);