import { DraggableNode } from './draggableNode';
import { MdOutlineInput, MdOutlineOutput } from 'react-icons/md';
import { GiArtificialHive } from 'react-icons/gi';
import { FaRegFileAlt } from 'react-icons/fa';
import { MdFunctions } from 'react-icons/md';

export const PipelineToolbar = () => {
    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customInput' label='Input' icon={<MdOutlineInput className="text-green-500" />} />
                <DraggableNode type='llm' label='LLM' icon={<GiArtificialHive className="text-orange-500" />} />
                <DraggableNode type='customOutput' label='Output' icon={<MdOutlineOutput className="text-blue-500" />} />
                <DraggableNode type='text' label='Text' icon={<FaRegFileAlt className="text-purple-500" />} />
                <DraggableNode type='math' label='Math' icon={<MdFunctions className="text-yellow-500" />} />
            </div>
        </div>
    );
};