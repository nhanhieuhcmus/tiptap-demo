import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import TablePicker from './TablePicker';
const SlashCommandsList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showTablePicker, setShowTablePicker] = useState(false);

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
      if (item.title === 'Table') {
        setShowTablePicker(true);
      } else {
        props.command(item);
      }
    }
  };

  const handleTableSelect = (rows, cols) => {
    const { editor, range } = props;
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setShowTablePicker(false);
  };

  if (showTablePicker) {
    return (
      <TablePicker
        onSelect={handleTableSelect}
        onClose={() => setShowTablePicker(false)}
      />
    );
  }

  return (
    <div className="slash-commands-list">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`slash-command-item ${index === selectedIndex ? 'selected' : ''}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="slash-command-title">{item.title}</div>
            {item.description && (
              <div className="slash-command-description">{item.description}</div>
            )}
          </button>
        ))
      ) : (
        <div className="slash-command-item">No results</div>
      )}
    </div>
  );
});

SlashCommandsList.displayName = 'SlashCommandsList';

export default SlashCommandsList;
