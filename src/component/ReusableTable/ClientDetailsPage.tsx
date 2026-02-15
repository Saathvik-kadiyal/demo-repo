import React, { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import "../../index.css";

export interface ClientRow {
  id: string;
  clientName: string;
  departmentCount: number;
  headcount: number;
  allowance: number;
}

interface Props {
  data: ClientRow[];
}

type SortKey = keyof ClientRow;

const ClientDetailsTable: React.FC<Props> = ({ data }) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("clientName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row.clientName.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginatedData = sortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="client-table-card">
      {/* Header */}
      <div className="table-header">
        <h2>Client Details</h2>
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("clientName")}>Client name</th>
              <th onClick={() => handleSort("departmentCount")}>
                Department
              </th>
              <th onClick={() => handleSort("headcount")}>
                Headcount
              </th>
              <th onClick={() => handleSort("allowance")}>
                Allowance
              </th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id}>
                <td className="client-name">{row.clientName}</td>
                <td className="center">{row.departmentCount}</td>
                <td className="center">{row.headcount}</td>
                <td className="right">
                  ₹{row.allowance.toLocaleString("en-IN")}
                </td>
                <td className="center">
                  <button className="view-btn">  <Eye size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(1)}>
          First
        </button>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span className="page-active">{page}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default ClientDetailsTable;
