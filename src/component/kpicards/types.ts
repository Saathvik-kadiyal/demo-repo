export interface LoaderProps {
  size?: string;
  shape?: "circle" | "rectangle";
}

export interface KpiCardProps {
  loading?: boolean;
  HeaderIcon: string;
  HeaderText: string;
  BodyNumber: string | number;
  BodyComparisionNumber: string | number;
  iconSize?: string;
  BodyNumberSize?: string;
  comparisonSign?: string;
}

export interface ShiftKpiCardProps {
  loading?: boolean;
  ShiftType:string;
  ShiftCount:number;
  ShiftCountry:string;
  ShiftCountSize:string;
  ShiftTypeSize:string;
}