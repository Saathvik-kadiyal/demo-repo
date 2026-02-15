import React, { useState } from "react";
import Eye from "../../assets/eye.svg";

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function isPrimitive(value) {
  return (
    value === null || ["string", "number", "boolean"].includes(typeof value)
  );
}

export default function ReusableTable({
  data,
  columns,
  nestedColumns,
  nestedKey = "children",
  getRowKey,
  className,
  rowClassName,
  cellClassName,
  headerClassName,
  noDataFallback = "No Data Available",
   onActionClick, 
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

      const childrenAreEmployees =
        hasChildren && children.every((c) => c.type === "employee");

      const elements = [];

      elements.push(
        <tr key={rowKey} className={rowClassName?.(row)}>
          {columns.map((col, colIndex) => {
            const value = getNestedValue(row, col.key);

            return (
              <td
                key={col.key}
                className={cellClassName}
                style={{
                  paddingLeft:
                    colIndex === 0 ? `${level * 20 + 8}px` : undefined,
                }}
              >
                {col.type === "action" ? (
                  hasChildren ? (
                    <button onClick={() => toggle(rowKey)}>
                      {expanded.has(rowKey) ? "▼" : "▶"}
                    </button>
                  ) : (
                    <button onClick={() => onActionClick?.(row)}>
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
        if (childrenAreEmployees && nestedColumns) {
          elements.push(
            <tr key={`${rowKey}-employee-table`}>
              <td colSpan={columns.length}>
                <ReusableTable
                  data={children}
                  columns={nestedColumns}
                  nestedColumns={nestedColumns}
                  nestedKey={nestedKey}
                  getRowKey={getRowKey}
                  rowClassName={rowClassName}
                  cellClassName={cellClassName}
                  headerClassName={headerClassName}
                  onActionClick={onActionClick} 
                />
              </td>
            </tr>
          );
        } else {
          elements.push(...renderRows(children, level + 1, rowKey));
        }
      }

      return elements;
    });
  };

  return (
    <table className={`reusable-table ${className || ""}`}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={headerClassName}
              style={{ textAlign: col.align || "left", width: col.width }}
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