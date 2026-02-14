import React from 'react';

interface DummyProps {
  text: string;
  color?: 'red' | 'blue' | 'green';
}

export const Dummy: React.FC<DummyProps> = ({ text, color = 'blue' }) => {
  return (
    <div className={`p-4 bg-${color}-500 text-white rounded`}>
      {text}
    </div>
  );
};
