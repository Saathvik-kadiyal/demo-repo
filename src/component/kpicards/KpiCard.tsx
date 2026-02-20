import React from "react";
import "../../index.css";
import { LoaderProps, KpiCardProps } from "./types";

import profitIcon from "../../assets/profit.svg";
import lossIcon from "../../assets/loss.svg";

const Loader: React.FC<LoaderProps> = ({
  size = "28px",
  shape = "circle",
}) => {
  return (
    <div
      className={`loader ${shape}`}
      style={{
        width: size,
        height: size,
        borderRadius: shape === "circle" ? "50%" : "4px",
      }}
    />
  );
};

const KpiCard: React.FC<KpiCardProps> = ({
  loading = false,
  HeaderIcon,
  HeaderText,
  BodyNumber,
  BodyComparisionNumber,
  iconSize = "28px",
  BodyNumberSize = "20px",
  width = "214px",
  height = "132px",
}) => {
  const getComparisonType = (value: any) => {
    if (!value) return null;

    const stringValue = String(value).toLowerCase();

    if (stringValue.includes("decrease") || stringValue.includes("-")) {
      return "decrease";
    }

    if (stringValue.includes("increase") || stringValue.includes("+")) {
      return "increase";
    }

    return null;
  };

  const comparisonType = getComparisonType(BodyComparisionNumber);

  return (
    <div
      className="kpiCard shrink-0"
      style={{ width, height }}
    >

      {/* Header */}
      <div className="kpiHeader">
        {loading ? (
          <Loader size={iconSize} shape="circle" />
        ) : (
          HeaderIcon && (
            <img
              src={HeaderIcon}
              alt="Header Icon"
              style={{ width: iconSize, height: iconSize }}
            />
          )
        )}
        <p>{HeaderText}</p>
      </div>

      {/* Body */}
      <div className="kpiBody">
        {loading ? (
          <Loader size={BodyNumberSize} shape="rectangle" />
        ) : (
          <h3 style={{ fontSize: BodyNumberSize }}>{BodyNumber}</h3>
        )}

        {/* Comparison */}
        {!loading && BodyComparisionNumber && (
          <p className={`comparison ${comparisonType} flex flex-row align-bottom`}>
            {comparisonType && (
              <img
                src={comparisonType === "increase" ? profitIcon : lossIcon}
                alt={comparisonType}
                style={{ width: "16px", marginRight: "6px" }}
              />
            )}
            {BodyComparisionNumber}
          </p>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
