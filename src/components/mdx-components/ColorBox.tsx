import React from 'react';

interface ColorBoxProps {
  color: string;
}

const ColorBox = ({ color }: ColorBoxProps): React.ReactElement => {
  return (
    <div
      style={{
        maxWidth: '200px',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 0 25px rgba(0,0,0,0.1)',
        display: 'inline-block',
        margin: '10px',
      }}
    >
      <div
        style={{
          background: color,
          height: '150px',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '200px',
          height: '50px',
        }}
      >
        <span style={{ textAlign: 'center' }}>{color}</span>
      </div>
    </div>
  );
};

export default ColorBox;
