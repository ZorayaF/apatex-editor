import React from "react";
import { Box, Text, Table } from "@mantine/core";
import { useStore } from "@store";
import { APA_CONFIG } from "@core/utils/measurements";

export const TableBlock = ({ id, data, title, note }) => {
  const { blocks, updateBlock, setSelectedBlockId } = useStore();

  // Numeración automática basada en la posición en el array de bloques
  const tableNumber =
    blocks.filter((b) => b.type === "table").findIndex((b) => b.id === id) + 1;

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex] = [...newData[rowIndex]];
    newData[rowIndex][colIndex] = value;
    updateBlock(id, { data: newData });
  };

  return (
    <Box
      w="100%"
      py="md"
      className="apa-table-container"
      onClick={() => setSelectedBlockId(id)}
    >
      {/* Etiqueta: Tabla X (Negrita) */}
      <Text
        fw={700}
        style={{ fontSize: `${APA_CONFIG.typography.size}pt` }}
        mb={0}
      >
        Tabla {tableNumber}
      </Text>

      {/* Título: Cursiva */}
      <Text
        fs="italic"
        style={{ fontSize: `${APA_CONFIG.typography.size}pt` }}
        mb="md"
      >
        {title || "Título de la tabla"}
      </Text>

      <Table withColumnBorders={false} withRowBorders={false}>
        <thead>
          <tr
            style={{
              borderTop: "2px solid black",
              borderBottom: "1px solid black",
            }}
          >
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
            <tr
              key={rowIndex}
              style={
                rowIndex === data.length - 2
                  ? { borderBottom: "2px solid black" }
                  : {}
              }
            >
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

      {/* Nota: Tamaño 10pt (2 puntos menos que el base) */}
      {note && (
        <Text
          mt="xs"
          style={{
            fontSize: `${APA_CONFIG.typography.size - 2}pt`,
            textAlign: "left",
          }}
        >
          {note}
        </Text>
      )}
    </Box>
  );
};
