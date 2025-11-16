import React from 'react';

const Title = (props: React.ComponentPropsWithoutRef<'h4'>) => {
  return (
    <h4 {...props} style={{
      fontSize: '18px',
      color: '#ff8326',
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
        background: 'linear-gradient(to right, #ff8326, #ffe9d5)',
      }} />
    </h4>
  );
};

export default Title;
