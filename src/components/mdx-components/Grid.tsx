import React from 'react';

interface GridProps {
  templateColumns?: string | string[];
  gap?: number | number[];
  children?: React.ReactNode;
}

const Grid = ({ templateColumns = 'repeat(4, 1fr)', gap = 6, children }: GridProps): React.ReactElement => {
  // Handle responsive templateColumns
  let gridTemplateColumns = templateColumns;
  if (Array.isArray(templateColumns)) {
    gridTemplateColumns = templateColumns[templateColumns.length - 1];
  }

  // Handle gap (multiply by 4 for rem conversion like Chakra)
  const gapValue = Array.isArray(gap) ? gap[0] : gap;
  const gapRem = `${gapValue * 0.25}rem`;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: gridTemplateColumns as string,
        gap: gapRem,
        margin: '20px 0',
      }}
    >
      {children}
    </div>
  );
};

export default Grid;
