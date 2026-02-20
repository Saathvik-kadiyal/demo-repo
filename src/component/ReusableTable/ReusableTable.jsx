import React, { useState } from "react";
import Eye from "../../assets/eye.svg";
import dropDownIcon from "../../assets/arrow.svg";
import "../../index.css";

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
  onSort,
  sortConfig,
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
        <tr
          key={rowKey}
          className={rowClassName?.(row)}
          style={{
            backgroundColor: row.type === "department" ? "#EAF2FB" : undefined,
          }}
        >
          {columns.map((col, colIndex) => {
            const value = getNestedValue(row, col.key);

            return (
              <td
                key={col.key}
                className={cellClassName}
                style={{
                  paddingLeft:
                    colIndex ===0 ||colIndex===1 ? `${level + 10}px` : undefined,
                }}
              >
                {col.type === "action" ? (
                  hasChildren ? (
                    <button onClick={() => toggle(rowKey)}>

                      <span
                        className={`toggle-icon inline-block transition-transform duration-200 ${
                          expanded.has(rowKey) ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <img src={dropDownIcon} alt="dropdown-arrow" />
                      </span>
                    </button>
                  ) : (
                    <button onClick={() => onActionClick?.(row)}>
                      <img src={Eye} alt="view" />
                    </button>
                  )
                ) : colIndex === 0 && row.type === "department" ? (
                  <div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      Department
                    </div>
                    <div style={{ fontWeight: 500 }}>{value}</div>
                  </div>
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
              <td colSpan={columns.length} style={{padding:0}}>
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
      <div
    className="reusable-table-wrapper"
  >
    <table className={`reusable-table ${className || ""}`}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={headerClassName}
              style={{
                textAlign: col.align || "left",
                width: col.width,
                cursor: col.sortable ? "pointer" : "default",

               
              }}
              onClick={() => {
                if (!col.sortable) return;

                const order =
                  sortConfig?.key === col.key && sortConfig?.order === "asc"
                    ? "desc"
                    : "asc";

                onSort?.({
                  key: col.key,
                  sort_by: col.sortKey || col.key,
                  order,
                });
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {col.header}
                {col.sortable && (
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: 4,
                      fontSize: 10,
                      lineHeight: 1,
                    }}
                  >
                    <span
                      style={{
                        color:
                          sortConfig?.key === col.key &&
                          sortConfig?.order === "asc"
                            ? "#1C2F72"
                            : "#C0C4CC",
                      }}
                    >
                      ▲
                    </span>
                    <span
                      style={{
                        color:
                          sortConfig?.key === col.key &&
                          sortConfig?.order === "desc"
                            ? "#1C2F72"
                            : "#C0C4CC",
                      }}
                    >
                      ▼
                    </span>
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{renderRows(data)}</tbody>
    </table>
  </div>
  );
}
