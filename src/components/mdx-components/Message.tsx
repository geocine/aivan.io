import React from 'react';

interface MessageProps {
  type?: 'warning' | 'success' | 'info';
  children?: React.ReactNode;
}

const Message = ({ type, children }: MessageProps): React.ReactElement => {
  const styles: Record<string, React.CSSProperties> = {
    base: {
      padding: '0.8em 1em',
      borderLeft: '4px solid rgb(255, 142, 1)',
      lineHeight: '1.2',
      textAlign: 'center',
      position: 'relative',
      clear: 'both',
    },
    info: {
      background: '#fff1df',
      color: '#4a2900',
    },
    warning: {
      background: 'rgba(247, 168, 139, 0.15)',
      borderLeft: '4px solid rgb(255, 96, 69)',
      color: '#4a2900',
    },
    success: {
      borderLeft: '4px solid rgb(138, 199, 61)',
      color: 'rgb(41, 100, 1)',
      background: 'rgb(234, 245, 231)',
    },
  };

  const typeStyle = type ? styles[type] : styles.info;

  return (
    <p style={{ ...styles.base, ...typeStyle }}>
      {children}
    </p>
  );
};

export default Message;
