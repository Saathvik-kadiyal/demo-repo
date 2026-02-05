import React from 'react';
import "../../index.css";
import { LoaderProps, KpiCardProps } from "./types";

const Loader: React.FC<LoaderProps> = ({ size = '28px', shape = 'circle' }) => {
  return (
    <div
      className={`loader ${shape}`}
      style={{ width: size, height: size, borderRadius: shape === 'circle' ? '50%' : '0' }}
    ></div>
  );
};

const KpiCard: React.FC<KpiCardProps> = ({
  loading = false,
  HeaderIcon,
  HeaderText,
  BodyNumber,
  BodyComparisionNumber,
  iconSize = '28px',
  BodyNumberSize = '2rem',
  comparisonSign = 'arrow',
}) => {

  return (
    <div className="kpiCard">
      <div className="kpiHeader">
        {loading ? (
          <Loader size={iconSize} shape="circle" />
        ) : (
          <img src={HeaderIcon} alt="Header Icon" style={{ width: iconSize, height: iconSize }} />
        )}
        <p>{HeaderText}</p>
      </div>
      <div className="kpiBody">
        {loading ? (
          <Loader size={BodyNumberSize} shape="rectangle" />
        ) : (
          <h3 style={{ fontSize: BodyNumberSize }}>{BodyNumber}</h3>
        )}

        {loading ? (
          <Loader size="20px" shape="rectangle" />
        ) : (
          <p>
            <span>{comparisonSign}</span>{BodyComparisionNumber}
          </p>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
