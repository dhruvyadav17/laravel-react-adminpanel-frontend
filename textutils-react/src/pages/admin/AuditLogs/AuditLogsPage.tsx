import { useState } from "react";
import { useGetAuditLogsQuery } from "@/store/api";

import AuditLogsTable from "./components/AuditLogsTable";
import AuditLogsFilters from "./components/AuditLogsFilters";
import Can from "@/components/common/Can";

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<string | undefined>();

  const { data, isLoading } = useGetAuditLogsQuery({
    page,
    action,
  });

  return (
    <Can permission="audit-view">
      <section className="content pt-3">
        <div className="container-fluid">
          <h3 className="mb-3">Audit Logs</h3>

          <AuditLogsFilters
            action={action}
            onActionChange={(value) => {
              setPage(1);
              setAction(value);
            }}
          />

          <AuditLogsTable
            logs={data?.data ?? []}
            loading={isLoading}
          />

          {data?.meta && (
            <div className="d-flex justify-content-end mt-3 gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>

              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={page >= data.meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </Can>
  );
}
