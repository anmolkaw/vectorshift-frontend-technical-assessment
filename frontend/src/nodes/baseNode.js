// baseNode.js

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const POSITION_MAP = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

const getPositionValue = (position = 'right') => {
  return POSITION_MAP[position] || position;
};

const getSide = (position = 'right') => {
  if (position === Position.Left || position === 'left') return 'left';
  if (position === Position.Right || position === 'right') return 'right';
  if (position === Position.Top || position === 'top') return 'top';
  if (position === Position.Bottom || position === 'bottom') return 'bottom';
  return 'right';
};

const getDefaultFieldValue = (field, id, data) => {
  if (data && Object.prototype.hasOwnProperty.call(data, field.name)) {
    return data[field.name];
  }

  if (typeof field.defaultValue === 'function') {
    return field.defaultValue({ id, data });
  }

  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  return field.type === 'checkbox' ? false : '';
};

const getHandleId = (nodeId, handle) => {
  if (handle.fullId) return handle.fullId;
  return `${nodeId}-${handle.id}`;
};

const buildHandleLayout = (handles) => {
  const counts = handles.reduce((acc, handle) => {
    const side = getSide(handle.position);
    acc[side] = (acc[side] || 0) + 1;
    return acc;
  }, {});

  const seen = {};

  return handles.map((handle) => {
    const side = getSide(handle.position);
    seen[side] = (seen[side] || 0) + 1;

    const count = counts[side] || 1;
    const offset = handle.offset || `${(seen[side] * 100) / (count + 1)}%`;
    const coordinateStyle =
      side === 'left' || side === 'right'
        ? { top: offset }
        : { left: offset };

    return {
      ...handle,
      side,
      positionValue: getPositionValue(handle.position),
      coordinateStyle,
    };
  });
};

const FieldControl = ({ id, field, data, updateNodeField }) => {
  const value = getDefaultFieldValue(field, id, data);

  const handleChange = (event) => {
    const nextValue =
      field.type === 'checkbox' ? event.target.checked : event.target.value;
    updateNodeField(id, field.name, nextValue);
  };

  if (field.render) {
    return field.render({ id, data, value, onChange: handleChange });
  }

  if (field.type === 'select') {
    return (
      <label className="node-field">
        <span>{field.label}</span>
        <select
          className="node-input nodrag"
          value={value}
          onChange={handleChange}
        >
          {field.options.map((option) => {
            const optionValue =
              typeof option === 'string' ? option : option.value;
            const optionLabel =
              typeof option === 'string' ? option : option.label;
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      </label>
    );
  }

  if (field.type === 'textarea') {
    return (
      <label className="node-field">
        <span>{field.label}</span>
        <textarea
          className="node-input node-textarea nodrag"
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          rows={field.rows || 3}
          style={field.style}
        />
      </label>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="node-checkbox">
        <input
          className="nodrag"
          type="checkbox"
          checked={Boolean(value)}
          onChange={handleChange}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <label className="node-field">
      <span>{field.label}</span>
      <input
        className="node-input nodrag"
        type={field.inputType || field.type || 'text'}
        value={value}
        min={field.min}
        max={field.max}
        step={field.step}
        onChange={handleChange}
        placeholder={field.placeholder}
      />
    </label>
  );
};

// BaseNode centralizes the repeated React Flow node shell while letting each
// node stay declarative about its fields, handles, styling, and custom content.
export const BaseNode = ({
  id,
  data,
  title,
  description,
  fields = [],
  handles = [],
  children,
  accent = '#4f7cff',
  className = '',
  style,
}) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const laidOutHandles = buildHandleLayout(handles);

  return (
    <div
      className={`vs-node ${className}`}
      style={{ '--node-accent': accent, ...style }}
    >
      {laidOutHandles.map((handle) => {
        const handleId = getHandleId(id, handle);
        return (
          <div key={handleId}>
            <Handle
              className={`vs-handle vs-handle--${handle.side} ${
                handle.className || ''
              }`}
              type={handle.type}
              position={handle.positionValue}
              id={handleId}
              isConnectable={handle.isConnectable}
              style={{ ...handle.coordinateStyle, ...handle.style }}
            />
            {handle.label && handle.showLabel !== false && (
              <span
                className={`node-handle-label node-handle-label--${handle.side}`}
                style={handle.coordinateStyle}
              >
                {handle.label}
              </span>
            )}
          </div>
        );
      })}

      <div className="node-header">
        <div>
          <div className="node-title">{title}</div>
          {description && <div className="node-description">{description}</div>}
        </div>
      </div>

      {(fields.length > 0 || children) && (
        <div className="node-body">
          {fields.map((field) => (
            <FieldControl
              key={field.name}
              id={id}
              field={field}
              data={data}
              updateNodeField={updateNodeField}
            />
          ))}
          {children}
        </div>
      )}
    </div>
  );
};
