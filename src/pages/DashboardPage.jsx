import { useState } from "react";
import "../index.css";

import ReusableTable from "../component/ReusableTable/ReusableTable";
import ActionButton from "../component/buttons/ActionButton";
import ShiftKpiCard from "../component/kpicards/ShiftKpiCard";

import {normalizeDashboardData } from "../component/ReusableTable/normalizeApiData";
import {  dashboardColumns } from "../component/ReusableTable/columns";

// 👉 use any dataset here
import { rawDataSet1 } from "./dummyData";

export default function DashboardPage() {
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const tableData = normalizeDashboardData(rawDataSet1);

  const handleUpload = () => {
  };

  return (
    <div
      className={`
        relative w-full justify-center px-4 py-4 overflow-x-hidden
        ${clientDialogOpen ? "overflow-y-hidden h-full" : "overflow-y-auto h-auto"}
      `}
    >
      {/* KPI */}
      <div className="flex flex-wrap gap-4">
        <ShiftKpiCard
          loading={false}
          ShiftType="USA"
          ShiftCount={20}
          ShiftCountry="USA/IND"
          ShiftCountSize="2rem"
          ShiftTypeSize="2rem"
        />
      </div>

      {/* ACTION */}
      <ActionButton
        content={() => (
          <button className="actionBtn" onClick={handleUpload}>
            <span>+</span>
            <p>Upload File</p>
          </button>
        )}
      />

      {/* TABLE */}
      <div className="w-[60%] rounded-xl py-4 overflow-x-auto bg-white">
        <ReusableTable
          data={tableData}
          columns={dashboardColumns}
        />
      </div>
    </div>
  );
}
