# Frontend

This folder contains the React frontend for the VectorShift frontend technical
assessment. It implements a node-based pipeline builder with React Flow and
Zustand.

For the full project overview, backend details, architecture notes, and testing
instructions, see the root `README.md`.

## Key Source Files

- `src/App.js`
  - App shell that renders the toolbar, canvas, and submit controls.
- `src/ui.js`
  - React Flow canvas setup, node registration, drag/drop handling, and graph
    event wiring.
- `src/store.js`
  - Zustand store for nodes, edges, node ids, and field updates.
- `src/toolbar.js`
  - Node library rendered from the shared node registry.
- `src/draggableNode.js`
  - Node palette tile with drag-and-drop and click-to-add behavior.
- `src/submit.js`
  - Sends the current graph to the backend parser.
- `src/index.css`
  - Application, canvas, node, form, handle, and submit styling.
- `src/nodes/baseNode.js`
  - Shared node abstraction for layout, fields, handles, labels, and custom
    content.
- `src/nodes/nodeDefinitions.js`
  - Central registry for node types, labels, categories, components, and initial
    data.
- `src/nodes/demoNodes.js`
  - Five example nodes built with the shared abstraction.
- `src/nodes/textNode.js`
  - Text node auto-resizing and dynamic variable handle logic.

## Available Scripts

Run these commands from this `frontend` directory.

### `npm start`

Starts the development server.

```bash
npm start
```

Open:

```text
http://localhost:3000
```

### `npm run build`

Builds the frontend for production.

```bash
npm run build
```

### `npm test`

Starts the Create React App test runner.

```bash
npm test
```

## Node Abstraction

Nodes are defined using composition around `BaseNode`.

Simple nodes provide configuration such as:

- title
- description
- accent color
- fields
- handles
- optional custom body content

This keeps new node implementations small and prevents repeated node container,
form, and handle code across files.

## Text Node Behavior

The Text node supports:

- automatic width and height growth based on entered text
- sensible minimum and maximum dimensions
- parsing variables written as `{{ variableName }}`
- unique left-side input handles for valid variables
- React Flow internals updates when dynamic handles change

Valid variables follow:

```text
^[A-Za-z_$][A-Za-z0-9_$]*$
```

## Backend Connection

The frontend submit button sends:

```json
{
  "nodes": [],
  "edges": []
}
```

to:

```text
http://localhost:8000/pipelines/parse
```

The backend responds with:

```json
{
  "num_nodes": 0,
  "num_edges": 0,
  "is_dag": true
}
```
