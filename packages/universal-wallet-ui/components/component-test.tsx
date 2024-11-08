import * as React from 'react';

type ComponentTest = React.HTMLAttributes<HTMLElement>;

const ComponentTest = ({ children, className }: ComponentTest) => { 

 return(
  <div className={className}>
   {children}
  </div>
)}
 export { ComponentTest };