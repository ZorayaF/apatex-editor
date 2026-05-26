import { Table } from "@mantine/core";
import { useStore } from "@store";
import classes from "./TableBlock.module.css";

export const TableBlock = ({ id, data, title, note, type }) => {
  const { blocks, updateBlock, setSelectedBlockId } = useStore();

  // Numeración automática basada en la posición en el array de bloques (Soporta table y tableBlock)
  const tableNumber =
    blocks
      .filter((b) => b.type === "table" || b.type === "tableBlock")
      .findIndex((b) => b.id === id) + 1;

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex] = [...newData[rowIndex]];
    newData[rowIndex][colIndex] = value;
    updateBlock(id, { data: newData });
  };

  return (
    <div
      className={classes.tableContainer}
      onClick={() => setSelectedBlockId(id)}
    >
      {/* Etiqueta: Tabla X (Negrita nativa por CSS) */}
      <p className={classes.metaLabel}>Tabla {tableNumber}</p>

      {/* Título: Cursiva nativa por CSS */}
      <p className={classes.metaTitle}>{title || "Título de la tabla"}</p>

      <Table
        withColumnBorders={false}
        withRowBorders={false}
        className={classes.apaTable}
      >
        <thead>
          <tr>
            {data[0].map((cell, i) => (
              <th key={i} style={{ padding: 0 }}>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleCellChange(0, i, e.currentTarget.innerText)
                  }
                  className="editable-cell"
                  style={{ fontWeight: 700 }}
                >
                  {cell}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} style={{ padding: 0 }}>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleCellChange(
                        rowIndex + 1,
                        colIndex,
                        e.currentTarget.innerText,
                      )
                    }
                    className="editable-cell"
                  >
                    {cell}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Nota reglamentaria al pie */}
      {note && <p className={classes.tableNote}>{note}</p>}
    </div>
  );
};
