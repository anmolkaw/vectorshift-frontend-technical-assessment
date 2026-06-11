// draggableNode.js

import { useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';
import { createNodeData } from './nodes/nodeDefinitions';

const selector = (state) => ({
  nodes: state.nodes,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
});

export const DraggableNode = ({ type, label }) => {
    const isDragging = useRef(false);
    const { nodes, getNodeID, addNode } = useStore(selector, shallow);

    const addNodeToCanvas = () => {
      const nodeID = getNodeID(type);
      const column = nodes.length % 2;
      const row = Math.floor(nodes.length / 2);
      addNode({
        id: nodeID,
        type,
        position: {
          x: 80 + column * 310,
          y: 80 + row * 230,
        },
        data: createNodeData(nodeID, type),
      });
    };

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      isDragging.current = true;
      event.currentTarget.classList.add('is-dragging');
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const onDragEnd = (event) => {
      event.currentTarget.classList.remove('is-dragging');
      window.setTimeout(() => {
        isDragging.current = false;
      }, 0);
    };

    const handleClick = () => {
      if (!isDragging.current) {
        addNodeToCanvas();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        addNodeToCanvas();
      }
    };

    const initials = label
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  
    return (
      <div
        className="draggable-node"
        data-node-type={type}
        role="button"
        tabIndex={0}
        aria-label={`Add ${label} node`}
        title={`Add ${label} node`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={onDragEnd}
        draggable
      >
          <span className="draggable-node__icon">{initials}</span>
          <span className="draggable-node__label">{label}</span>
      </div>
    );
  };
  
