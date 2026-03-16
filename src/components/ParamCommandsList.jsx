import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
const ParamCommandsList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  const selectItem = index => {
    const item = props.items[index];
    if (item) {
      const { editor, range } = props;
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertParameter(item.paramName, item.label)
        .run();
    }
  };

  return (
    <div className="param-commands-list">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`param-command-item ${index === selectedIndex ? 'selected' : ''}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="param-command-title">@{item.paramName}</div>
            <div className="param-command-label">{item.label}</div>
            {item.description && (
              <div className="param-command-description">{item.description}</div>
            )}
          </button>
        ))
      ) : (
        <div className="param-command-item">No params found</div>
      )}
    </div>
  );
});

ParamCommandsList.displayName = 'ParamCommandsList';

export default ParamCommandsList;
