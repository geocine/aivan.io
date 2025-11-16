import React from 'react';

const SmallTitle = (props: React.ComponentPropsWithoutRef<'h3'>) => {
  return (
    <h3 {...props} style={{
      fontSize: '24px',
      color: '#71ac25',
      lineHeight: '1.1',
      display: 'flex',
      alignItems: 'center',
      margin: '50px 0 25px',
      gap: '15px',
      ...props.style,
    }}>
      {props.children}
      <span style={{
        flexGrow: 1,
        height: '2px',
        borderRadius: '2px',
        background: 'linear-gradient(to right, #8ad22c, #e6ffc6)',
      }} />
    </h3>
  );
};

export default SmallTitle;
