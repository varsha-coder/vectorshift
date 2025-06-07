import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { submitPipeline } from './submit';
import { useStore } from './store';

function App() {
  // Get nodes and edges from Zustand store
  const nodes = useStore(state => state.nodes);
  const edges = useStore(state => state.edges);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PipelineToolbar />
      <PipelineUI />
      <div className="flex justify-center mt-8 mb-4">
        <button
          onClick={() => submitPipeline(nodes, edges)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold text-lg"
        >
          Submit Pipeline
        </button>
      </div>
    </div>
  );
}

export default App;