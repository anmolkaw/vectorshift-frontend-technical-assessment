// submit.js

import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState('');

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setStatus('Analyzing pipeline...');

        try {
            const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.detail || 'Pipeline analysis failed.');
            }

            const message = [
                'Pipeline analysis complete',
                `Nodes: ${result.num_nodes}`,
                `Edges: ${result.num_edges}`,
                `Directed acyclic graph: ${result.is_dag ? 'Yes' : 'No'}`,
            ].join('\n');

            setStatus('Analysis complete.');
            window.alert(message);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Unable to analyze pipeline.';
            setStatus('Analysis failed.');
            window.alert(`Pipeline analysis failed\n${message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="submit-panel">
            <span className="submit-status" role="status">
                {status}
            </span>
            <button
                className="submit-button"
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Analyzing...' : 'Submit Pipeline'}
            </button>
        </div>
    );
}
