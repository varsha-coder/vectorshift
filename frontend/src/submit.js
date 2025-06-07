import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationCircle } from "react-icons/fa";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// UI color palette for consistency
const PRIMARY_COLOR = '#2563eb';   // Match Submit Pipeline button (bg-blue-600)
const NODE_BG_COLOR = '#e3f0ff';   // Node background (from genericNode.js: bg-blue-50)
const ERROR_COLOR = '#f44336';     // Red for negative

export async function submitPipeline(nodes, edges) {
    try {
        const response = await axios.post(`${BACKEND_URL}/pipelines/parse`, {
            nodes,
            edges,
        });
        const { num_nodes, num_edges, is_dag } = response.data;

        toast.info(
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                position: "relative",
                textAlign: "center",
                width: "100%",
            }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                        fontWeight: 700,
                        fontSize: '1.1em',
                        marginBottom: 2,
                        color: PRIMARY_COLOR,
                        textAlign: "center"
                    }}>
                        Pipeline Analysis
                    </div>
                    <div style={{ fontSize: '1em', lineHeight: 1.7, textAlign: "center" }}>
                        <div><b>No. of Nodes:</b> {num_nodes}</div>
                        <div><b>No. of Edges:</b> {num_edges}</div>
                        <div><b>Is DAG:</b> {is_dag ? 'Yes' : 'No'}</div>
                    </div>
                </div>
            </div>,
            {
                style: {
                    background: NODE_BG_COLOR,
                    border: `2px solid ${PRIMARY_COLOR}`,
                    borderRadius: '1rem',
                    minWidth: 280,
                    fontWeight: 500,
                    boxShadow: "0 4px 24px 0 rgba(37,99,235,0.10)",
                    padding: "1.1rem 1.3rem",
                    position: "relative",
                    textAlign: "center"
                },
                position: "top-center",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
                closeButton: ({ closeToast }) => (
                    <button
                        onClick={closeToast}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            padding: 0,
                            position: 'absolute',
                            top: 12,
                            right: 16,
                            zIndex: 2,
                        }}
                        aria-label="close"
                    >
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="10" fill={PRIMARY_COLOR} fillOpacity="0.13"/>
                            <path d="M7 7L13 13M13 7L7 13" stroke={PRIMARY_COLOR} strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                ),
            }
        );
    } catch (error) {
        toast.error(
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                position: "relative",
                textAlign: "center",
                width: "100%",
            }}>
                <FaExclamationCircle style={{ color: ERROR_COLOR, fontSize: 28 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                        fontWeight: 700,
                        color: ERROR_COLOR,
                        marginBottom: 2,
                        fontSize: "1.1em",
                        textAlign: "center"
                    }}>
                        Error
                    </div>
                    <div style={{ textAlign: "center" }}>
                        Failed to submit pipeline: {error.response?.data?.detail || error.message}
                    </div>
                </div>
            </div>,
            {
                style: {
                    background: NODE_BG_COLOR,
                    border: `2px solid ${ERROR_COLOR}`,
                    borderRadius: '1rem',
                    minWidth: 280,
                    fontWeight: 500,
                    boxShadow: "0 4px 24px 0 rgba(244,67,54,0.10)",
                    padding: "1.1rem 1.3rem",
                    position: "relative",
                    textAlign: "center"
                },
                position: "top-center",
                autoClose: 7000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
                closeButton: ({ closeToast }) => (
                    <button
                        onClick={closeToast}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            padding: 0,
                            position: 'absolute',
                            top: 12,
                            right: 16,
                            zIndex: 2,
                        }}
                        aria-label="close"
                    >
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="10" fill={ERROR_COLOR} fillOpacity="0.13"/>
                            <path d="M7 7L13 13M13 7L7 13" stroke={ERROR_COLOR} strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                ),
            }
        );
    }
}

// Place this ToastContainer in your main App component (if not already present):
// <ToastContainer />