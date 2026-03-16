import { useState } from 'react';

const TablePicker = ({ onSelect, onClose }) => {
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });
  const maxRows = 5;
  const maxCols = 5;

  const handleCellHover = (row, col) => {
    setHoveredCell({ row, col });
  };

  const handleCellClick = (row, col) => {
    onSelect(row + 1, col + 1);
    onClose();
  };

  const renderGrid = () => {
    const cells = [];
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        const isHighlighted = row <= hoveredCell.row && col <= hoveredCell.col;
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`table-picker-cell ${isHighlighted ? 'highlighted' : ''}`}
            onMouseEnter={() => handleCellHover(row, col)}
            onClick={() => handleCellClick(row, col)}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="table-picker-container">
      <div className="table-picker-grid">
        {renderGrid()}
      </div>
      <div className="table-picker-label">
        {hoveredCell.row + 1} x {hoveredCell.col + 1}
      </div>
    </div>
  );
};

export default TablePicker;
