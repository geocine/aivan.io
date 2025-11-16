import React from 'react';

const Separator = (props: React.ComponentPropsWithoutRef<'hr'>) => {
  return (
    <hr {...props} style={{
      width: '15%',
      borderTop: '4px solid #006cb7',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      margin: '2.5em auto 2.3em',
      ...props.style,
    }} />
  );
};

export default Separator;
