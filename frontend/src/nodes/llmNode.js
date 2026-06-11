import { BaseNode } from './baseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      description="Generate a model response"
      accent="#4f46e5"
      handles={[
        { id: 'system', type: 'target', position: 'left', label: 'System' },
        { id: 'prompt', type: 'target', position: 'left', label: 'Prompt' },
        { id: 'response', type: 'source', position: 'right', label: 'Response' },
      ]}
    >
      <div className="node-note">System and prompt inputs merge into one response.</div>
    </BaseNode>
  );
};
