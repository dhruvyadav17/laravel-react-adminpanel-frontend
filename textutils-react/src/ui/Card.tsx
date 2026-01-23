import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <div className={`card card-outline card-primary ${className}`}>
      {children}
    </div>
  );
}
