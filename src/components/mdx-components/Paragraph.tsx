import React from 'react';

const Paragraph = (props: React.ComponentPropsWithoutRef<'p'>) => {
  const className = props.className ? `mdx-paragraph ${props.className}` : 'mdx-paragraph';

  return (
    <p {...props} style={{
      lineHeight: '1.6',
      fontSize: '18px',
      margin: '15px 0',
      ...props.style,
    }} className={className}>
      {props.children}
    </p>
  );
};

export default Paragraph;
