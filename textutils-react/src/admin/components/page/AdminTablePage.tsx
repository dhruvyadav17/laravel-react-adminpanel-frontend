import AdminPage from "./AdminPage";
import AdminCard from "../ui/AdminCard";
import DataTable from "../table/DataTable";

type Props = {
  title: string;
  permission?: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;

  loading?: boolean;
  empty?: boolean;
  emptyText?: string;

  columns: React.ReactNode;
  colSpan: number;
  children: React.ReactNode;

  /** optional extra content (search etc.) */
  topContent?: React.ReactNode;
};

export default function AdminTablePage({
  title,
  permission,
  actionLabel,
  actionIcon,
  onAction,
  loading,
  empty,
  emptyText,
  columns,
  colSpan,
  children,
  topContent,
}: Props) {
  return (
    <AdminPage
      title={title}
      permission={permission}
      actionLabel={actionLabel}
      actionIcon={actionIcon}
      onAction={onAction}
    >
      {topContent}

      <AdminCard
        title={`${title} List`}
        loading={loading}
        empty={empty}
        emptyText={emptyText}
      >
        <DataTable
          columns={columns}
          colSpan={colSpan}
          isLoading={loading}
          isEmpty={empty}
        >
          {children}
        </DataTable>
      </AdminCard>
    </AdminPage>
  );
}
