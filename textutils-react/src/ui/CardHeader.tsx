import React from "react";

type Props = {
  title?: string;
  action?: React.ReactNode;
};

export default function CardHeader({ title, action }: Props) {
  return (
    <div className="card-header d-flex justify-content-between align-items-center">
      {title && <h3 className="card-title mb-0">{title}</h3>}
      {action}
    </div>
  );
}
