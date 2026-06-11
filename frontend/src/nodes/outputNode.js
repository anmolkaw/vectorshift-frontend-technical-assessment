import { BaseNode } from './baseNode';

export const OutputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Output"
      description="Finish with a named result"
      accent="#ea580c"
      fields={[
        {
          name: 'outputName',
          label: 'Name',
          type: 'text',
          defaultValue: id.replace('customOutput-', 'output_'),
        },
        {
          name: 'outputType',
          label: 'Type',
          type: 'select',
          defaultValue: 'Text',
          options: ['Text', 'Image', 'File', 'JSON'],
        },
      ]}
      handles={[
        { id: 'value', type: 'target', position: 'left', label: 'Value' },
      ]}
    />
  );
};
