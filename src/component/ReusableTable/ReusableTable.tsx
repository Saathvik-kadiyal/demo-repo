import React, { useState } from "react";
import { Column, ReusableTableProps } from "./types";
import "../../index.css";

function normalizeNestedData(value: any, nestedKeyField?: string): any[] {
  if (Array.isArray(value)) return value;

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).map(([key, v]) => ({
      ...(v as object),
      ...(nestedKeyField ? { [nestedKeyField]: key } : {}),
    }));
  }

  return [];
}

const ReusableTable = <T,>({
  data,
  columns,
  getRowKey,
  noDataFallback = "No Data Available",

  className,
  wrapperClassName,
  style,
  wrapperStyle,
  headerStyle,
  cellStyle,
}: ReusableTableProps<T>) => {
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());

  const toggleCell = (cellKey: string) => {
    setExpandedCells((prev) => {
      const next = new Set(prev);
      next.has(cellKey) ? next.delete(cellKey) : next.add(cellKey);
      return next;
    });
  };

  const isPrimitive = (val: any) =>
    val === null ||
    val === undefined ||
    typeof val === "string" ||
    typeof val === "number" ||
    typeof val === "boolean";

  if (!data.length) return <div>{noDataFallback}</div>;

  return (
    <div
      className={`reusable-table-wrapper ${wrapperClassName ?? ""}`}
      style={wrapperStyle}
    >
      <table
        className={`reusable-table ${className ?? ""}`}
        style={style}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{
                  width: col.width,
                  textAlign: col.align ?? "left",
                  ...headerStyle,
                }}
              >
                {typeof col.header === "function"
                  ? col.header(data)
                  : col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => {
            const rowKey = getRowKey?.(row, rowIndex) ?? rowIndex;

            return (
              <tr key={rowKey}>
                {columns.map((col) => {
                  const value = (row as any)[col.key];
                  const cellKey = `${rowKey}-${String(col.key)}`;
                  const isExpanded = expandedCells.has(cellKey);

                  return (
                    <td key={String(col.key)} style={cellStyle}>
                      {/* 🔽 EXPAND BUTTON */}
                      {col.nestedColumns && (
                        <button
                          onClick={() => toggleCell(cellKey)}
                          style={{ marginRight: 6 }}
                        >
                          {isExpanded ? "▼" : "▶"}
                        </button>
                      )}

                      {/* 🔽 CELL CONTENT */}
                      {isPrimitive(value)
                        ? col.render
                          ? col.render(value, row)
                          : String(value)
                        : null}

                      {/* 🔽 NESTED TABLE */}
                      {isExpanded && col.nestedColumns && (
                        <div style={{ marginTop: 8 }}>
                          <ReusableTable
                            data={normalizeNestedData(
                              value,
                              col.nestedKeyField
                            )}
                            columns={col.nestedColumns}
                            getRowKey={(nestedRow, nestedIndex) =>
                              `${cellKey}-${nestedIndex}`
                            }
                          />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
