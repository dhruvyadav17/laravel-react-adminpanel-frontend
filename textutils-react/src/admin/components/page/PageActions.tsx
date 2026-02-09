import PageHeader from "./PageHeader";
import Button from "../../../components/common/Button";
import Can from "../../../components/common/Can";

type Props = {
  title: string;
  permission?: string;
  buttonLabel?: string;
  icon?: string;
  onClick?: () => void;
};

export default function PageActions({
  title,
  permission,
  buttonLabel,
  icon,
  onClick,
}: Props) {
  const action =
    permission && buttonLabel && onClick ? (
      <Can permission={permission}>
        <Button label={buttonLabel} icon={icon} onClick={onClick} />
      </Can>
    ) : null;

  return <PageHeader title={title} action={action} />;
}
