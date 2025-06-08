# VectorShift Frontend Technical Assessment

This project is a React-based pipeline editor featuring a node abstraction system, advanced styling, dynamic text node logic, and backend integration for pipeline analysis.

## Features

### 1. Node Abstraction

- All node types (Input, Output, LLM, Text, Math, and 5+ custom nodes) are built using a single, flexible `GenericNode` abstraction.
- New nodes can be created quickly by specifying their label, icon, fields, handles, and description.
- Consistent styling and behavior across all nodes.

### 2. Unified Styling

- Modern, visually appealing design using Tailwind CSS and custom styles.
- Responsive, interactive UI for both the pipeline editor and toolbar.
- Nodes feature smooth transitions, custom icons, and intuitive controls.

### 3. Advanced Text Node Logic

- The Text node's input area auto-resizes in width and height as the user types.
- Users can define variables using double curly brackets (e.g., `{{input}}`).
- Each detected variable creates a new Handle on the left side of the node for easy pipeline connections.

### 4. Backend Integration

- The frontend connects to a FastAPI backend.
- On clicking "Submit Pipeline", the app sends the current nodes and edges to the backend.
- The backend responds with the number of nodes, number of edges, and whether the pipeline forms a Directed Acyclic Graph (DAG).
- Results are displayed in a styled toast notification.

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.8+ (for backend)

### Setup

#### Frontend

```bash
cd frontend_technical_assessment/frontend
npm install
npm start
```

#### Backend

```bash
cd ../backend
pip install -r requirements.txt
uvicorn main:app --reload
```

- The frontend runs on [http://localhost:3000](http://localhost:3000)
- The backend runs on [http://localhost:8000](http://localhost:8000)

### Usage

1. Drag nodes from the toolbar onto the canvas.
2. Connect nodes by dragging from one node's handle to another.
3. Edit node fields as needed.
4. For Text nodes, type variables using `{{variableName}}` to create new handles.
5. Click "Submit Pipeline" to analyze your pipeline.
6. View the analysis results in the notification.

## Customization

- To add new node types, create a new file in `src/nodes/` and use the `GenericNode` abstraction.
- Update `src/ui.js` to register your new node type.

## License

This project is for technical assessment and demonstration purposes.
