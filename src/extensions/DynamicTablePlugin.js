import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

export const DynamicTablePlugin = Extension.create({
  name: 'dynamicTablePlugin',

  addOptions() {
    return {
      seatData: [],
    };
  },

  addProseMirrorPlugins() {
    const extension = this;

    return [
      new Plugin({
        key: new PluginKey('dynamicTablePlugin'),

        appendTransaction: (transactions, oldState, newState) => {
          // Only process if there are actual document changes
          const docChanged = transactions.some(tr => tr.docChanged);
          if (!docChanged) return null;

          const tr = newState.tr;
          let modified = false;
          const processedTables = new Set();

          newState.doc.descendants((node, pos) => {
            if (node.type.name === 'table') {
              if (processedTables.has(pos)) return;
              processedTables.add(pos);

              const firstRow = node.child(0);
              if (!firstRow) return;

              const paramsFound = [];
              firstRow.forEach((cell, offset, index) => {
                cell.descendants(paramNode => {
                  if (paramNode.type.name === 'dataParam') {
                    paramsFound.push({
                      paramName: paramNode.attrs.paramName,
                      colIndex: index,
                    });
                  }
                });
              });

              if (paramsFound.length === 0 || extension.options.seatData.length === 0) {
                return;
              }

              const currentRowCount = node.childCount;
              const neededRowCount = extension.options.seatData.length + 1;
              const colCount = firstRow.childCount;

              if (currentRowCount < neededRowCount) {
                const rowsToAdd = neededRowCount - currentRowCount;
                let currentInsertPos = pos + node.nodeSize - 1;
                
                for (let i = 0; i < rowsToAdd; i++) {
                  const dataIndex = currentRowCount - 1 + i;
                  const seatDataItem = extension.options.seatData[dataIndex];
                  if (!seatDataItem) continue;

                  const cells = [];
                  for (let colIdx = 0; colIdx < colCount; colIdx++) {
                    const paramForCol = paramsFound.find(p => p.colIndex === colIdx);
                    
                    let cellContent = '';
                    if (paramForCol) {
                      const paramMap = {
                        'seat_code': seatDataItem.code,
                        'passenger_name': seatDataItem.passenger,
                        'status': seatDataItem.status,
                      };
                      cellContent = paramMap[paramForCol.paramName] || '';
                    }

                    const cellNode = newState.schema.nodes.tableCell.create(
                      null,
                      newState.schema.nodes.paragraph.create(
                        null,
                        cellContent ? newState.schema.text(cellContent) : null
                      )
                    );
                    cells.push(cellNode);
                  }

                  const rowNode = newState.schema.nodes.tableRow.create(null, cells);                  
                  tr.insert(currentInsertPos, rowNode);                  
                  currentInsertPos += rowNode.nodeSize;
                  modified = true;
                }
              }
              
              else {
                const maxRowsToProcess = Math.min(node.childCount - 1, extension.options.seatData.length);
                for (let rowIdx = maxRowsToProcess; rowIdx >= 1; rowIdx--) {
                  const row = node.child(rowIdx);
                  const dataIndex = rowIdx - 1;
                  const seatDataItem = extension.options.seatData[dataIndex];
                  if (!seatDataItem) continue;

                  let needsUpdate = false;
                  row.forEach((cell, cellOffset, colIdx) => {
                    const paramForCol = paramsFound.find(p => p.colIndex === colIdx);
                    if (paramForCol) {
                      let cellHasContent = false;
                      cell.descendants(n => {
                        if (n.type.name === 'text' && n.text.trim().length > 0) {
                          cellHasContent = true;
                        }
                      });
                      if (!cellHasContent) {
                        needsUpdate = true;
                      }
                    }
                  });

                  if (needsUpdate) {
                    let rowPos = pos + 1;
                    for (let i = 0; i < rowIdx; i++) {
                      rowPos += node.child(i).nodeSize;
                    }

                    const newCells = [];
                    for (let colIdx = 0; colIdx < colCount; colIdx++) {
                      const paramForCol = paramsFound.find(p => p.colIndex === colIdx);
                      
                      let cellContent = '';
                      if (paramForCol) {
                        const paramMap = {
                          'seat_code': seatDataItem.code,
                          'passenger_name': seatDataItem.passenger,
                          'status': seatDataItem.status,
                        };
                        cellContent = paramMap[paramForCol.paramName] || '';
                      } else {
                        // Keep existing content for non-parameter cells
                        const existingCell = row.child(colIdx);
                        existingCell.descendants(n => {
                          if (n.type.name === 'text') {
                            cellContent = n.text;
                          }
                        });
                      }

                      const newCell = newState.schema.nodes.tableCell.create(
                        null,
                        newState.schema.nodes.paragraph.create(
                          null,
                          cellContent ? newState.schema.text(cellContent) : null
                        )
                      );
                      newCells.push(newCell);
                    }

                    const newRow = newState.schema.nodes.tableRow.create(null, newCells);
                    
                    // Replace the old row with new row
                    tr.replaceWith(rowPos, rowPos + row.nodeSize, newRow);
                    modified = true;
                  }
                }
              }
            }
          });

          return modified ? tr : null;
        },
      }),
    ];
  },
});
