import React from 'react'

const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="card">{children}</div>
  );
  
  export const CardContent = ({ children }: { children: React.ReactNode }) => (
    <div className="card-content">{children}</div>
  );
  
  export const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="card-header">{children}</div>
  );
  
  export const CardTitle = ({ title }: { title: string }) => (
    <h2 className="card-title">{title}</h2>
  );
  
  export default Card;
  
  

  