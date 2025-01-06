import React from 'react';
import './Gauge.css';

const Gauge = ({ value, minValue, maxValue, title, needleColor, color }) => {
  // Ensure value is within bounds
  const boundedValue = Math.min(Math.max(value, minValue), maxValue);
  
  // Calculate rotation angle (0 degrees is at -90 degrees from vertical)
  const rotation = -90 + ((boundedValue - minValue) / (maxValue - minValue)) * 180;

  return (
    <div className="gauge">
      <div className="gauge-body">
        <div className="gauge-fill" style={{ background: color }}></div>
        {/* Create tick marks */}
        <div className="gauge-ticks">
          {[...Array(11)].map((_, index) => (
            <div
              key={index}
              className="gauge-tick"
              style={{ transform: `rotate(${-90 + index * 18}deg)` }}
            />
          ))}
        </div>
        <div
          className="gauge-needle"
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            backgroundColor: needleColor,
            color: needleColor
          }}
        ></div>
        <div className="gauge-center" style={{ backgroundColor: needleColor }}></div>
      </div>
      <div className="gauge-labels">
        <span>{minValue}</span>
        <span>{maxValue}</span>
      </div>
    </div>
  );
};

export default Gauge;