import React, { useState } from "react";
import Eye from "../../assets/eye.svg";

function isPrimitive(value) {
  return (
    value === null || ["string", "number", "boolean"].includes(typeof value)
  );
}

export default function ReusableTable({
  data,
  columns,
  nestedKey = "children",
  getRowKey,
  className,
  style,
  rowClassName,
  cellStyle,
  headerStyle,
  noDataFallback = "No Data Available",
}) {
  const [expanded, setExpanded] = useState(new Set());

  if (!data?.length) return <div>{noDataFallback}</div>;

  const toggle = (key) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const renderRows = (rows, level = 0, parentKey = "") => {
    return rows.flatMap((row, index) => {
      const rowKey =
        getRowKey?.(row, index) ?? `${parentKey}-${row.name || index}-${level}`;

      const children = row?.[nestedKey] || [];
      const hasChildren = Array.isArray(children) && children.length > 0;

      const elements = [];

      elements.push(
        <tr key={rowKey} className={rowClassName?.(row)}>
          {columns.map((col, colIndex) => {
            const value = row[col.key];

            return (
              <td
                key={col.key}
                style={{
                  ...cellStyle,
                  paddingLeft:
                    colIndex === 0 ? `${level * 20 + 8}px` : cellStyle?.padding,
                }}
              >
                {col.type === "action" ? (
                  hasChildren ? (
                    <button onClick={() => toggle(rowKey)}>
                      {expanded.has(rowKey) ? "▼" : "▶"}
                    </button>
                  ) : (
                    <button>
                      <img src={Eye} alt="view" />
                    </button>
                  )
                ) : col.render ? (
                  col.render(value, row, { hasChildren, toggle, expanded })
                ) : isPrimitive(value) ? (
                  value
                ) : (
                  ""
                )}
              </td>
            );
          })}
        </tr>
      );

      if (hasChildren && expanded.has(rowKey)) {
        elements.push(...renderRows(children, level + 1, rowKey));
      }

      return elements;
    });
  };

  return (
    <table className={`reusable-table ${className || ""}`} style={style}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                textAlign: col.align || "left",
                width: col.width,
                ...headerStyle,
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{renderRows(data)}</tbody>
    </table>
  );
}
