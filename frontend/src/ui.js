// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { createNodeData, NODE_TYPES } from './nodes/nodeDefinitions';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      return createNodeData(nodeID, type);
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }

            if (!reactFlowInstance) {
              return;
            }

            const position = reactFlowInstance.screenToFlowPosition
              ? reactFlowInstance.screenToFlowPosition({
                  x: event.clientX,
                  y: event.clientY,
                })
              : reactFlowInstance.project({
                  x: event.clientX - reactFlowBounds.left,
                  y: event.clientY - reactFlowBounds.top,
                });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [addNode, getNodeID, reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <section className="pipeline-canvas-shell" ref={reactFlowWrapper}>
            <ReactFlow
                className="pipeline-canvas"
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={NODE_TYPES}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                snapToGrid
                connectionLineType='smoothstep'
            >
                <Background
                  color="#cbd5e1"
                  gap={gridSize}
                  size={1.2}
                  variant={BackgroundVariant.Dots}
                />
                <Controls />
                <MiniMap
                  pannable
                  zoomable
                  nodeStrokeWidth={3}
                  nodeColor="#ffffff"
                  maskColor="rgba(15, 23, 42, 0.08)"
                />
            </ReactFlow>
        </section>
    )
}
