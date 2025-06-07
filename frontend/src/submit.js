import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// UI color palette for consistency
const PRIMARY_COLOR = '#2563eb';   // Match Submit Pipeline button (bg-blue-600)
const NODE_BG_COLOR = '#e3f0ff';   // Node background (from genericNode.js: bg-blue-50)
const ERROR_COLOR = '#f44336';     // Red for negative

// Add a border style to match the node (e.g., 2px solid PRIMARY_COLOR)
const ALERT_BORDER_STYLE = `2px solid ${PRIMARY_COLOR}`;

export async function submitPipeline(nodes, edges) {
    try {
        const response = await axios.post(`${BACKEND_URL}/pipelines/parse`, {
            nodes,
            edges,
        });
        const { num_nodes, num_edges, is_dag } = response.data;

        toast.info(
            <div style={{ color: PRIMARY_COLOR }}>
                <div style={{ fontWeight: 700, fontSize: '1.1em', marginBottom: 4 }}>Pipeline Analysis</div>
                <div style={{ fontSize: '1em', lineHeight: 1.7 }}>
                    <div><b>No. of Nodes:</b> {num_nodes}</div>
                    <div><b>No. of Edges:</b> {num_edges}</div>
                    <div><b>Is DAG:</b> {is_dag ? 'Yes' : 'No'}</div>
                </div>
            </div>,
            {
                style: {
                    background: NODE_BG_COLOR,
                    border: `2px solid ${PRIMARY_COLOR}`,
                    borderRadius: '0.75rem',
                    minWidth: 260,
                    fontWeight: 500,
                },
                position: "top-center",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
            }
        );
    } catch (error) {
        toast.error(
            <div>
                <div style={{ fontWeight: 700, color: ERROR_COLOR, marginBottom: 4 }}>Error</div>
                <div>
                    Failed to submit pipeline: {error.response?.data?.detail || error.message}
                </div>
            </div>,
            {
                style: {
                    background: NODE_BG_COLOR,
                    border: `2px solid ${ERROR_COLOR}`,
                    borderRadius: '0.75rem',
                    minWidth: 260,
                    fontWeight: 500,
                },
                position: "top-center",
                autoClose: 7000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
            }
        );
    }
}