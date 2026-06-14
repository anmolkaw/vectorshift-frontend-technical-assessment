# VectorShift Frontend Technical Assessment

This repository contains a completed node-based pipeline editor built with
React, React Flow, Zustand, and a small FastAPI backend. The frontend lets users
compose pipelines by adding nodes, connecting handles, editing node fields, and
submitting the graph to the backend for analysis.

The implementation focuses on four assignment areas:

- reusable node abstraction
- polished node editor styling
- Text node auto-resizing and variable handles
- frontend-to-backend pipeline parsing with DAG detection

## Project Structure

```text
.
|-- backend/
|   |-- main.py
|   `-- requirements.txt
|-- frontend/
|   |-- public/
|   |   |-- favicon.ico
|   |   |-- index.html
|   |   |-- manifest.json
|   |   `-- robots.txt
|   |-- src/
|   |   |-- App.js
|   |   |-- draggableNode.js
|   |   |-- index.css
|   |   |-- index.js
|   |   |-- store.js
|   |   |-- submit.js
|   |   |-- toolbar.js
|   |   |-- ui.js
|   |   `-- nodes/
|   |       |-- baseNode.js
|   |       |-- demoNodes.js
|   |       |-- inputNode.js
|   |       |-- llmNode.js
|   |       |-- nodeDefinitions.js
|   |       |-- outputNode.js
|   |       `-- textNode.js
|   |-- package.json
|   |-- package-lock.json
|   `-- README.md
|-- VectorShift - Frontend Technical Assessment Instructions.pdf
`-- README.md
```

## Frontend Overview

The frontend is a Create React App application using React Flow for the canvas
and Zustand for graph state.

### Main Files

- `frontend/src/App.js`
  - Defines the application shell.
  - Renders the node toolbar, React Flow canvas, and submit button.

- `frontend/src/ui.js`
  - Owns the React Flow canvas.
  - Registers node types through `NODE_TYPES`.
  - Handles drag-and-drop node creation.
  - Connects React Flow events to Zustand store actions.

- `frontend/src/store.js`
  - Stores `nodes`, `edges`, and node id counters.
  - Provides graph mutation helpers such as `addNode`, `onConnect`,
    `onNodesChange`, `onEdgesChange`, and `updateNodeField`.

- `frontend/src/toolbar.js`
  - Renders the node library from the shared node definition registry.
  - Keeps the toolbar in sync with registered node types.

- `frontend/src/draggableNode.js`
  - Represents a node tile in the toolbar.
  - Supports drag-and-drop and click-to-add behavior.

- `frontend/src/submit.js`
  - Sends the current nodes and edges to the backend.
  - Displays a user-facing alert with node count, edge count, and DAG status.

- `frontend/src/index.css`
  - Contains the visual design for the app shell, toolbar, canvas, nodes,
    handles, inputs, and submit controls.

## Node System Architecture

The node system is centered on a reusable `BaseNode` component and a central
node definition registry.

### BaseNode

`frontend/src/nodes/baseNode.js` centralizes shared node behavior:

- node container layout
- header and optional description
- common field rendering
- input/select/textarea/checkbox controls
- field updates into Zustand node data
- arbitrary React Flow handles
- handle labels
- handle positioning
- styling hooks such as accent color and custom class names
- optional custom body content through `children`

This avoids copying node layout and form logic every time a new node is added.

### Node Definitions

`frontend/src/nodes/nodeDefinitions.js` is the single registry for node metadata.
It defines:

- node type ids used by React Flow
- labels shown in the toolbar
- categories used by the node library
- React component mappings
- initial data for newly created nodes

`NODE_TYPES` is derived from this registry and passed directly to React Flow.
This keeps node registration and toolbar rendering aligned.

### Existing Nodes

The original assignment nodes were refactored to use `BaseNode`:

- `InputNode`
- `OutputNode`
- `LLMNode`
- `TextNode`

Each existing node now focuses on what makes it unique: title, description,
fields, handles, and any custom body content.

### Demonstration Nodes

Five additional example nodes were added in `frontend/src/nodes/demoNodes.js`:

- `MathNode`
- `FilterNode`
- `ApiRequestNode`
- `TranslatorNode`
- `ConditionalNode`

These nodes demonstrate the abstraction across different combinations of form
fields and handle layouts.

## Text Node Behavior

The Text node has two enhanced behaviors.

### Auto-Resizing

`frontend/src/nodes/textNode.js` calculates dimensions from the current text:

- the longest line influences node width
- line count and estimated wrapping influence textarea height
- dimensions are clamped to sensible minimum and maximum values

This improves readability while preventing uncontrolled growth.

### Variable Handles

Users can define variables using double curly braces:

```text
Hello {{ name }}, your id is {{ userId }}
```

Valid variables must match JavaScript identifier-style rules:

```text
^[A-Za-z_$][A-Za-z0-9_$]*$
```

Examples of valid variables:

```text
{{input}}
{{ userName }}
{{_data}}
{{$value}}
{{data123}}
```

Examples of ignored invalid variables:

```text
{{123abc}}
{{user-name}}
{{user name}}
{{}}
```

Each unique valid variable creates a left-side target handle. Duplicate
variables create only one handle. Handle ids are stable and derived from the
node id plus the variable name.

React Flow caches handle positions, so the Text node calls
`useUpdateNodeInternals(id)` whenever variables or node dimensions change. This
ensures newly added or removed handles can be connected reliably.

## Backend Overview

The backend is a small FastAPI application in `backend/main.py`.

### Endpoints

- `GET /`
  - Health check endpoint.
  - Returns `{"Ping": "Pong"}`.

- `POST /pipelines/parse`
  - Accepts JSON containing `nodes` and `edges`.
  - Returns:

```json
{
  "num_nodes": 0,
  "num_edges": 0,
  "is_dag": true
}
```

### DAG Detection

The backend treats each node as a graph vertex and each edge as a directed edge
from `source` to `target`.

It uses Kahn's algorithm:

1. Build adjacency and indegree maps.
2. Start with all nodes that have indegree `0`.
3. Repeatedly remove nodes with indegree `0`.
4. If all nodes are visited, the graph is a DAG.
5. If some nodes remain unvisited, the graph contains a cycle.

The parser handles empty graphs, single-node graphs, disconnected graphs, and
malformed edge objects gracefully.

## Running The Project

Run the backend and frontend in separate terminals.

### Backend

```bash
cd backend
python3 -m pip install -r requirements.txt
python3 -m uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Interactive API docs:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend URL:

```text
http://localhost:3000
```

## Testing

### Frontend Build Check

```bash
cd frontend
npm run build
```

### Backend Endpoint Check

Acyclic graph:

```bash
curl -X POST http://127.0.0.1:8000/pipelines/parse \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [{"id": "a"}, {"id": "b"}],
    "edges": [{"source": "a", "target": "b"}]
  }'
```

Expected response:

```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

Cyclic graph:

```bash
curl -X POST http://127.0.0.1:8000/pipelines/parse \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [{"id": "a"}, {"id": "b"}],
    "edges": [
      {"source": "a", "target": "b"},
      {"source": "b", "target": "a"}
    ]
  }'
```

Expected response:

```json
{
  "num_nodes": 2,
  "num_edges": 2,
  "is_dag": false
}
```

## Manual Demo Flow

1. Start the backend.
2. Start the frontend.
3. Open `http://localhost:3000`.
4. Add an `Input` node.
5. Add an `Output` node.
6. Connect `Input.value` to `Output.value`.
7. Click `Submit Pipeline`.
8. Confirm the alert displays:
   - number of nodes
   - number of edges
   - whether the graph is a DAG

## Implementation Notes

- The node abstraction uses composition rather than inheritance because React
  components are easier to extend through props and children.
- Node field values are stored in React Flow node data through Zustand.
- Dynamic Text node handles are derived from text content and do not need to be
  separately persisted.
- Backend DAG detection ignores malformed edges that do not reference known
  node ids, but still reports the submitted edge count.
- No additional frontend UI libraries were introduced.
