import { useState, useMemo } from "react";

export default function ReusableTable({
  columns = [],
  data = [],
  loading = false,

message = "No data available.",
  totalCount,          // REQUIRED for API pagination
  onPageChange,        // if provided → API pagination
  initialPage = 1,
  initialRowsPerPage,  // OPTIONAL → if not provided, limit selector hidden
}) {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(
    typeof initialRowsPerPage === "number" ? initialRowsPerPage : null
  );

  const isServerPagination = typeof onPageChange === "function";
  const hasLimit = typeof rowsPerPage === "number";

  /* =========================
     Pagination calculations
  ========================= */
  const totalRows = isServerPagination ? totalCount : data.length;
  const totalPages = hasLimit
    ? Math.ceil(totalRows / rowsPerPage)
    : 1;

  const paginatedData = useMemo(() => {
    if (!hasLimit || isServerPagination) return data;

  


    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage, isServerPagination, hasLimit]);

    const hasData = paginatedData.length > 0;

  /* =========================
     Page numbers (same UI logic)
  ========================= */
  const pages = useMemo(() => {
    if (totalPages <= 1) return [];

    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  /* =========================
     Handlers
  ========================= */
  const changePage = (p) => {
    if (p < 1 || p > totalPages) return;

    setPage(p);

    if (isServerPagination) {
      onPageChange({
        page: p,
        ...(hasLimit ? { limit: rowsPerPage } : {}),
      });
    }
  };

  const changeLimit = (e) => {
    const limit = Number(e.target.value);
    setRowsPerPage(limit);
    setPage(1);

    if (isServerPagination) {
      onPageChange({ page: 1, limit });
    }
  };

  /* =========================
     Render rows
  ========================= */
  const renderRows = (rows) =>
    rows.map((row, i) => (
      <tr key={i} className="border-b">
        {columns.map((col) => (
          <td key={col.key} className="px-4 py-2">
            {col.render ? col.render(row) : row[col.key]}
          </td>
        ))}
      </tr>
    ));

  /* =========================
     UI
  ========================= */
  return (
    <div className=" rounded-lg overflow-hidden">
      <table className="w-full text-sm">
       {(loading || hasData) && (
  <thead className="bg-gray-100">
    <tr>
      {columns.map((col) => (
        <th key={col.key} className="text-left px-4 py-2">
          {col.label}
        </th>
      ))}
    </tr>
  </thead>
)}

<tbody>
  {loading ? (
    <tr>
      <td colSpan={columns.length} className="p-4 text-center">
        Loading...
      </td>
    </tr>
  ) : paginatedData.length ? (
    renderRows(paginatedData)
  ) : (
    <tr>
      <td colSpan={columns.length} className="p-4 text-center text-gray-500">
        {message}
      </td>
    </tr>
  )}
</tbody>

      </table>

      {/* =========================
         Pagination Footer
      ========================= */}
      {totalPages > 1 && (
        <div className="table-pagination">
          <div className="pagination-left">
            <button disabled={page === 1} onClick={() => changePage(1)}>
              ‹ First
            </button>

            <button disabled={page === 1} onClick={() => changePage(page - 1)}>
              ‹ Previous
            </button>

            {pages.map((p) => (
              <button
                key={p}
                className={p === page ? "active" : ""}
                onClick={() => changePage(p)}
              >
                {p}
              </button>
            ))}

            <span className="dots">…</span>

            <button
              disabled={page === totalPages}
              onClick={() => changePage(page + 1)}
            >
              Next ›
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => changePage(totalPages)}
            >
              Last ›
            </button>
          </div>

          {/* ✅ LIMIT IS OPTIONAL */}
          {hasLimit && (
            <div className="pagination-right">
              <select value={rowsPerPage} onChange={changeLimit}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
