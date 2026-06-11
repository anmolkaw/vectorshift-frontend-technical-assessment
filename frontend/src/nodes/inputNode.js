import { BaseNode } from './baseNode';

export const InputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      description="Start a pipeline value"
      accent="#0891b2"
      fields={[
        {
          name: 'inputName',
          label: 'Name',
          type: 'text',
          defaultValue: id.replace('customInput-', 'input_'),
        },
        {
          name: 'inputType',
          label: 'Type',
          type: 'select',
          defaultValue: 'Text',
          options: ['Text', 'File', 'Image', 'JSON'],
        },
      ]}
      handles={[
        { id: 'value', type: 'source', position: 'right', label: 'Value' },
      ]}
    />
  );
};
