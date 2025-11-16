import React from 'react';

const Anchor = (props: React.ComponentPropsWithoutRef<'a'>) => {
  return (
    <a {...props} style={{
      textDecoration: 'underline',
      color: '#0161ab',
      ...props.style,
    }}>
      {props.children}
    </a>
  );
};

export default Anchor;
