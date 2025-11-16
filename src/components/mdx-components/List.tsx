import React from 'react';

const List = (props: React.ComponentPropsWithoutRef<'ul'>) => {
  const className = props.className ? `mdx-list ${props.className}` : 'mdx-list';

  return (
    <ul {...props} style={{
      marginLeft: '20px',
      listStyleType: 'none',
      position: 'relative',
      ...props.style,
    }} className={className}>
      {props.children}
    </ul>
  );
};

export default List;
