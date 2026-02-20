import React from 'react';
import "../../index.css";
import { LoaderProps,ShiftKpiCardProps } from './types';

const Loader: React.FC<LoaderProps> = ({ size = '28px', shape = 'circle' }) => {
  return (
    <div
      className={`loader ${shape}`}
      style={{ width: size, height: size, borderRadius: shape === 'circle' ? '50%' : '0' }}
    ></div>
  );
};



const ShiftKpiCard: React.FC<ShiftKpiCardProps> = ({
  loading = false,
  ShiftType,
  ShiftCount,
ShiftCountry,
  ShiftCountSize = '18px',
  ShiftTypeSize='18px'
}) => {

  return (
    <div className="ShiftKpiCard">
      <div className="ShiftKpiBody">
        {loading ? (
          <Loader size={ShiftTypeSize} shape="rectangle" />
        ) : (
          <h3 className='text-5'>{ShiftType}</h3>
        )}
{
  loading?(
    <Loader size={ShiftCountSize} shape="rectangle"/>):
    (<h3 style={{fontSize:ShiftCountSize}}>{ShiftCount}</h3>
  )
}

        {loading ? (
          <Loader size="20px" shape="rectangle" />
        ) : (
          <p>
            <span>{ShiftCountry}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ShiftKpiCard;
