import React, { useState, useEffect } from "react";
import { updateEmployeeShift } from "../utils/helper";
import { useEmployeeData } from "../hooks/useEmployeeData";

const getDaysInMonth = (monthStr) => {
  if (!monthStr) return 31;
  const [year, month] = monthStr.split("-").map(Number);
  return new Date(year, month, 0).getDate();
};

const SHIFT_KEYS = ["PST_MST", "US_INDIA", "SG", "ANZ"];
const UI_LABEL = { PST_MST: "PST MST", US_INDIA: "US INDIA", SG: "SG", ANZ: "ANZ" };

const EmployeeModal = ({ employee, onClose, setPopupMessage, setPopupType }) => {
  const { setOnSave } = useEmployeeData();

    // console.log("Popup functions:", setPopupMessage, setPopupType);

  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Map employee.shift_details to top-level shift keys
useEffect(() => {
  if (employee) {
    const mappedData = {
      ...employee,
      ...SHIFT_KEYS.reduce((acc, key) => {
        // Take from shift_days if exists, otherwise default 0
        acc[key] = employee.shift_days?.[key] ?? 0;
        return acc;
      }, {}),
    };
    setData(mappedData);
  }
}, [employee]);

console.log(data)

  if ((!employee && !loading) || !data) return null;

  const updateShift = (key, value) => {
    if (!/^\d*$/.test(value)) {
      setPopupMessage("Only numeric values are allowed for shift days");
      setPopupType("error");
      const cleanedValue = value.replace(/\D/g, "");
      setData((prev) => ({
        ...prev,
        [key]: cleanedValue === "" ? "" : Number(cleanedValue),
      }));
      return;
    }

    setData((prev) => {
      const updated = { ...prev, [key]: value === "" ? "" : Number(value) };
      const totalShifts = SHIFT_KEYS.reduce(
        (sum, k) => sum + (Number(updated[k]) || 0),
        0
      );
      const monthDays = getDaysInMonth(updated.duration_month);
      if (totalShifts > monthDays) {
        setError(`Total shift days (${totalShifts}) exceed days in month (${monthDays})`);
      } else {
        setError("");
      }
      return updated;
    });
  };

  const resetChanges = () => {
    if (employee) {
      const mappedData = {
        ...employee,
        ...SHIFT_KEYS.reduce((acc, key) => {
          acc[key] = employee.shift_details?.[key] || 0;
          return acc;
        }, {}),
      };
      setData(mappedData);
    }
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("access_token");
        const payload = {
    shifts: SHIFT_KEYS.reduce((acc, key) => {
      acc[key] = String(data[key] || 0); // flatten for backend
      return acc;
    }, {}),
  };

      await updateEmployeeShift(
        data.emp_id,
        data.duration_month,
        data.payroll_month,
        payload
      );

      setPopupMessage(`EMP ID: ${data.emp_id} updated successfully`);
      setPopupType("success");

      setOnSave(true);
      onClose();
      setIsEditing(false);
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.message ||
        "Something went wrong";
      setPopupMessage(`EMP ID: ${data.emp_id} update failed: ${backendMessage}`);
      setPopupType("error");
    } finally {
      setSaving(false);
    }
  };

  // Remove non-primitive fields for Info display
  const fieldsToShow = { ...data };
  ["PST_MST", "US_INDIA", "SG", "ANZ", "emp_id", "emp_name", "total_allowance", "shift_details", "total"].forEach(
    (key) => delete fieldsToShow[key]
  );

  const formatDateDisplay = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (isNaN(d)) return value;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

 return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    onClick={() => {
      resetChanges();
      onClose();
    }}
  >
    <div
      className="relative w-full max-w-5xl rounded-2xl bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}
      <button
        onClick={() => {
          resetChanges();
          onClose();
        }}
        className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      {/* Header */}
      <div className="px-8 pt-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Employee Details – EMP ID:{" "}
          <span className="font-bold">{data.emp_id}</span>
        </h2>
        <p className="mt-1 text-sm text-gray-500">Update Fields</p>
      </div>

      {/* Body */}
      <div className="mt-6 max-h-[70vh] overflow-y-auto px-8 pb-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
          <Field label="EMP ID" value={data.emp_id} />
          <Field label="EMP NAME" value={data.emp_name} />

          <div>
            <Label>CURRENT STATUS(E)</Label>
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              Active
            </span>
          </div>

          <Field label="DEPARTMENT" value={data.department} />
          <Field label="CLIENT" value={data.client} />

          {/* <Field label="PROJECT" value={data.project} />
          <Field label="PROJECT CODE" value={data.project_code} /> */}

          <Field label="CLIENT PARTNER" value={data.client_partner} />
          {/* <Field label="PRACTICE LEAD" value={data.practice_lead} /> */}

          {/* <Field label="DELIVERY MANAGER" value={data.delivery_manager || "0"} /> */}
          <Field label="DURATION MONTH" value={data.duration_month} />

          <Field label="PAYROLL MONTH" value={data.payroll_month} />
          {/* <Field label="SHIFT B DAYS" value={data.SHIFT_B_DAYS || "0"} /> */}
        </div>

        {/* Shift Section */}
        <div className="mt-8">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            Shift Days
          </h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SHIFT_KEYS.map((key) => (
              <div
                key={key}
                className="rounded-lg border bg-gray-50 px-4 py-3"
              >
                <p className="text-xs font-semibold text-gray-600">
                  {UI_LABEL[key]}
                </p>

                {isEditing ? (
                  <input
                    type="text"
                    value={data[key]}
                    onChange={(e) => updateShift(key, e.target.value)}
                    className="mt-2 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {data[key] || 0}
                  </p>
                )}
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={resetChanges}
                className=" border rounded-sm px-6 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || Boolean(error)}
                className="rounded-sm bg-[#1E3A8A] px-6 py-2 text-sm font-medium text-white disabled:bg-blue-300"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
          <button
  onClick={() => setIsEditing(true)}
  className="
    mt-3
    bg-[#1E3A8A]
    hover:bg-[#16286b]
    text-white
    font-semibold
    rounded
    px-4
    py-1.5
    transition-colors
  "
>
  Edit
</button>

 
          )}
        </div>
      </div>
    </div>
  </div>
);

};

const formatLabel = (str) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const Info = ({ label, value }) => (
  <div className="flex items-center gap-1 text-sm">
    <span className="font-medium text-[16px]">{label}:</span>
    <span>{value}</span>
  </div>
);

const Label = ({ children }) => (
  <label className="mb-1 block text-xs font-semibold text-gray-600">
    {children}
  </label>
);

const Field = ({ label, value }) => (
  <div>
    <Label>{label}</Label>
    <div className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900">
      {value ?? "-"}
    </div>
  </div>
);


export default EmployeeModal;
