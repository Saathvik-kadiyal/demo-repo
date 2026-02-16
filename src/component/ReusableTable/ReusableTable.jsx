import React, { useState } from "react";
import Eye from "../../assets/eye.svg";
import dropDownIcon from "../../assets/arrow.svg";

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
     <tr
  key={rowKey}
  className={rowClassName?.(row)}
  style={{
    backgroundColor:
      row.type === "department" ? "#EAF2FB" : undefined,
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
                    colIndex === 0 ? `${level * 20 + 8}px` : undefined,
                }}
              >
                {col.type === "action" ? (
                  hasChildren ? (
                    <button onClick={() => toggle(rowKey)}>
  {/* {expanded.has(rowKey) ? (
    <span className="toggle-icon rotate-18"><img src={dropDownIcon} alt="dropdown-arrow"/></span>
  ) : (
    <span className="toggle-icon"><img src={dropDownIcon} alt="dropdown-arrow"/></span>
  )} */}

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
    <div style={{ fontWeight: 500 }}>
      {value}
    </div>
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