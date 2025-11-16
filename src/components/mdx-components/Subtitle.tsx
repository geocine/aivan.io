import React from 'react';

const Subtitle = (props: React.ComponentPropsWithoutRef<'h2'>) => {
  return (
    <h2 {...props} style={{
      fontSize: '32px',
      color: '#006cb7',
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
        background: 'linear-gradient(to right, #007cd2, #aedeff)',
      }} />
    </h2>
  );
};

export default Subtitle;
