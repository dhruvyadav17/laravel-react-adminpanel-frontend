import React from "react";

type Props = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
};

export default function AdminPageLayout({
  title,
  action,
  children,
  headerClassName = "",
  contentClassName = "",
}: Props) {
  return (
    <section className="content pt-3">
      <div className="container-fluid">
        {/* PAGE HEADER */}
        <div
          className={`card card-outline card-primary mb-3 ${headerClassName}`}
        >
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">{title}</h3>
            {action}
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className={contentClassName}>
          {children}
        </div>
      </div>
    </section>
  );
}
