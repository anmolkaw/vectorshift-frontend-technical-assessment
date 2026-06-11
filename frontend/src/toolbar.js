// toolbar.js

import { DraggableNode } from './draggableNode';
import { NODE_DEFINITIONS } from './nodes/nodeDefinitions';

export const PipelineToolbar = () => {
    const groupedNodes = NODE_DEFINITIONS.reduce((groups, node) => {
        const category = node.category || 'Other';
        groups[category] = groups[category] || [];
        groups[category].push(node);
        return groups;
    }, {});

    return (
        <aside className="pipeline-toolbar" aria-label="Pipeline nodes">
            <div className="toolbar-heading">
                <span className="toolbar-eyebrow">Node Library</span>
                <h2>Blocks</h2>
            </div>
            {Object.entries(groupedNodes).map(([category, nodes]) => (
                <section className="toolbar-section" key={category}>
                    <h3>{category}</h3>
                    <div className="toolbar-grid">
                        {nodes.map((node) => (
                            <DraggableNode
                                key={node.type}
                                type={node.type}
                                label={node.label}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </aside>
    );
};
