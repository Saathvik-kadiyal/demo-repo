import React from "react";

export type Column<T> = {
  key: keyof T | string;
  header: React.ReactNode | ((data: T[]) => React.ReactNode);
  width?: string | number;
  align?: "left" | "center" | "right";

  render?: (value: any, row: T) => React.ReactNode;

  // 🔽 nested support
  nestedColumns?: Column<any>[];
  nestedKeyField?: string;
};

export type ReusableTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  getRowKey?: (row: T, index: number) => React.Key;
  noDataFallback?: React.ReactNode;

  className?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
};


export interface ShiftSummary {
  head_count?: number;
  shiftA?: number;
  shiftB?: number;
  shiftC?: number;
  prime?: number;
  total?: number;
}

export interface ShiftRates {
  shiftA: number;
  shiftB: number;
  shiftC: number;
  prime: number;
}

export interface ShiftDashboardProps {
  loading: boolean;
  shiftSummary?: ShiftSummary;
  shiftRates: ShiftRates;
  formatINR: (amount: number) => string;
}
