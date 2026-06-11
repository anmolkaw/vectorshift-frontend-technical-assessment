import { useEffect, useMemo } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './baseNode';

const DEFAULT_TEXT = '{{ input }}';
const VARIABLE_PATTERN = /{{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*}}/g;
const MIN_WIDTH = 260;
const MAX_WIDTH = 560;
const MIN_HEIGHT = 178;
const MAX_HEIGHT = 440;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const extractTextVariables = (text = '') => {
  const variables = [];
  const seen = new Set();
  let match;

  VARIABLE_PATTERN.lastIndex = 0;

  while ((match = VARIABLE_PATTERN.exec(text)) !== null) {
    const variableName = match[1];
    if (!seen.has(variableName)) {
      seen.add(variableName);
      variables.push(variableName);
    }
  }

  return variables;
};

const getTextNodeSize = (text) => {
  const lines = text.split('\n');
  const longestLine = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const wrappedLineEstimate = Math.ceil(Math.max(text.length, 1) / 48);

  const width = clamp(260 + Math.max(longestLine - 22, 0) * 7, MIN_WIDTH, MAX_WIDTH);
  const textareaHeight = clamp(
    82 + (lines.length - 1) * 22 + Math.max(wrappedLineEstimate - 1, 0) * 16,
    82,
    280
  );
  const height = clamp(96 + textareaHeight, MIN_HEIGHT, MAX_HEIGHT);

  return { width, height, textareaHeight };
};

export const TextNode = ({ id, data }) => {
  const text = data?.text ?? DEFAULT_TEXT;
  const updateNodeInternals = useUpdateNodeInternals();
  const variables = useMemo(() => extractTextVariables(text), [text]);
  const variableSignature = variables.join('|');
  const size = useMemo(() => getTextNodeSize(text), [text]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals, variableSignature, size.width, size.height]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      description="Template with variables"
      accent="#9333ea"
      className="vs-node--text"
      style={{ width: size.width, minHeight: size.height }}
      fields={[
        {
          name: 'text',
          label: 'Text',
          type: 'textarea',
          defaultValue: DEFAULT_TEXT,
          rows: 4,
          style: { minHeight: size.textareaHeight },
        },
      ]}
      handles={[
        ...variables.map((variable, index) => ({
          id: `var-${variable}`,
          type: 'target',
          position: 'left',
          label: variable,
          offset: `${28 + ((index + 1) * 54) / (variables.length + 1)}%`,
          className: 'vs-handle--variable',
        })),
        { id: 'output', type: 'source', position: 'right', label: 'Text' },
      ]}
    />
  );
};
