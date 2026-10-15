import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div
      className={`max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
