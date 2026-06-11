// demoNodes.js

import { BaseNode } from './baseNode';

export const MathNode = (props) => (
  <BaseNode
    {...props}
    title="Math"
    description="Calculate with two values"
    accent="#2563eb"
    fields={[
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        defaultValue: 'Add',
        options: ['Add', 'Subtract', 'Multiply', 'Divide'],
      },
      {
        name: 'precision',
        label: 'Precision',
        type: 'number',
        inputType: 'number',
        min: 0,
        max: 8,
        defaultValue: 2,
      },
    ]}
    handles={[
      { id: 'a', type: 'target', position: 'left', label: 'A' },
      { id: 'b', type: 'target', position: 'left', label: 'B' },
      { id: 'result', type: 'source', position: 'right', label: 'Result' },
    ]}
  />
);

export const FilterNode = (props) => (
  <BaseNode
    {...props}
    title="Filter"
    description="Route records by condition"
    accent="#16a34a"
    fields={[
      {
        name: 'condition',
        label: 'Condition',
        type: 'text',
        placeholder: 'score > 80',
        defaultValue: 'score > 80',
      },
      {
        name: 'caseSensitive',
        label: 'Case sensitive',
        type: 'checkbox',
        defaultValue: false,
      },
    ]}
    handles={[
      { id: 'records', type: 'target', position: 'left', label: 'Rows' },
      { id: 'matched', type: 'source', position: 'right', label: 'Match' },
      { id: 'rejected', type: 'source', position: 'right', label: 'Reject' },
    ]}
  />
);

export const ApiRequestNode = (props) => (
  <BaseNode
    {...props}
    title="API Request"
    description="Call an external endpoint"
    accent="#dc2626"
    fields={[
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: 'POST',
        options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
      {
        name: 'endpoint',
        label: 'Endpoint',
        type: 'text',
        placeholder: 'https://api.example.com',
        defaultValue: 'https://api.example.com',
      },
    ]}
    handles={[
      { id: 'body', type: 'target', position: 'left', label: 'Body' },
      { id: 'response', type: 'source', position: 'right', label: 'Response' },
      { id: 'error', type: 'source', position: 'right', label: 'Error' },
    ]}
  />
);

export const TranslatorNode = (props) => (
  <BaseNode
    {...props}
    title="Translator"
    description="Translate text content"
    accent="#7c3aed"
    fields={[
      {
        name: 'language',
        label: 'Language',
        type: 'select',
        defaultValue: 'Spanish',
        options: ['Spanish', 'French', 'German', 'Japanese', 'Hindi'],
      },
      {
        name: 'tone',
        label: 'Tone',
        type: 'select',
        defaultValue: 'Neutral',
        options: ['Neutral', 'Formal', 'Friendly'],
      },
    ]}
    handles={[
      { id: 'text', type: 'target', position: 'left', label: 'Text' },
      {
        id: 'translation',
        type: 'source',
        position: 'right',
        label: 'Translation',
      },
    ]}
  />
);

export const ConditionalNode = (props) => (
  <BaseNode
    {...props}
    title="Conditional"
    description="Branch on an expression"
    accent="#ca8a04"
    fields={[
      {
        name: 'expression',
        label: 'Expression',
        type: 'text',
        placeholder: 'status === "approved"',
        defaultValue: 'status === "approved"',
      },
    ]}
    handles={[
      { id: 'value', type: 'target', position: 'left', label: 'Value' },
      { id: 'true', type: 'source', position: 'right', label: 'True' },
      { id: 'false', type: 'source', position: 'right', label: 'False' },
    ]}
  />
);
