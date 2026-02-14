import React from 'react';

interface SimpleProps {
  text: string;
}

export const Simple: React.FC<SimpleProps> = ({ text }) => {
  return (
    <div style={{ padding: '20px', background: '#3b82f6', color: 'white', borderRadius: '8px' }}>
      {text}
    </div>
  );
};
