import PageActions from "./PageActions";

type Props = {
  title: string;
  permission?: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
  children: React.ReactNode;
};

export default function AdminPage({
  title,
  permission,
  actionLabel,
  actionIcon,
  onAction,
  children,
}: Props) {
  return (
    <section className="content pt-3">
      <div className="container-fluid">
        <PageActions
          title={title}
          permission={permission}
          buttonLabel={actionLabel}
          icon={actionIcon}
          onClick={onAction}
        />

        {children}
      </div>
    </section>
  );
}
