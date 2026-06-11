// nodeDefinitions.js

import { InputNode } from './inputNode';
import { LLMNode } from './llmNode';
import { OutputNode } from './outputNode';
import { TextNode } from './textNode';
import {
  ApiRequestNode,
  ConditionalNode,
  FilterNode,
  MathNode,
  TranslatorNode,
} from './demoNodes';

export const NODE_DEFINITIONS = [
  {
    type: 'customInput',
    label: 'Input',
    category: 'Core',
    component: InputNode,
    initialData: (id) => ({
      inputName: id.replace('customInput-', 'input_'),
      inputType: 'Text',
    }),
  },
  {
    type: 'llm',
    label: 'LLM',
    category: 'Core',
    component: LLMNode,
  },
  {
    type: 'customOutput',
    label: 'Output',
    category: 'Core',
    component: OutputNode,
    initialData: (id) => ({
      outputName: id.replace('customOutput-', 'output_'),
      outputType: 'Text',
    }),
  },
  {
    type: 'text',
    label: 'Text',
    category: 'Core',
    component: TextNode,
    initialData: {
      text: '{{ input }}',
    },
  },
  {
    type: 'math',
    label: 'Math',
    category: 'Logic',
    component: MathNode,
    initialData: {
      operation: 'Add',
      precision: 2,
    },
  },
  {
    type: 'filter',
    label: 'Filter',
    category: 'Logic',
    component: FilterNode,
    initialData: {
      condition: 'score > 80',
      caseSensitive: false,
    },
  },
  {
    type: 'conditional',
    label: 'Conditional',
    category: 'Logic',
    component: ConditionalNode,
    initialData: {
      expression: 'status === "approved"',
    },
  },
  {
    type: 'apiRequest',
    label: 'API Request',
    category: 'Data',
    component: ApiRequestNode,
    initialData: {
      method: 'POST',
      endpoint: 'https://api.example.com',
    },
  },
  {
    type: 'translator',
    label: 'Translator',
    category: 'Language',
    component: TranslatorNode,
    initialData: {
      language: 'Spanish',
      tone: 'Neutral',
    },
  },
];

export const NODE_TYPES = NODE_DEFINITIONS.reduce((acc, definition) => {
  acc[definition.type] = definition.component;
  return acc;
}, {});

export const getNodeDefinition = (type) => {
  return NODE_DEFINITIONS.find((definition) => definition.type === type);
};

export const createNodeData = (id, type) => {
  const definition = getNodeDefinition(type);
  const initialData =
    typeof definition?.initialData === 'function'
      ? definition.initialData(id)
      : definition?.initialData || {};

  return {
    id,
    nodeType: type,
    label: definition?.label || type,
    ...initialData,
  };
};
