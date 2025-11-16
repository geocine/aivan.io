import React from 'react';

const NumberedList = (props: React.ComponentPropsWithoutRef<'ol'>) => {
  const className = props.className ? `mdx-numbered-list ${props.className}` : 'mdx-numbered-list';

  return (
    <ol {...props} style={{
      padding: '0 0 0 30px',
      listStyle: 'none',
      counterReset: 'numList',
      position: 'relative',
      ...props.style,
    }} className={className}>
      {props.children}
    </ol>
  );
};

export default NumberedList;
