import { useEffect, useState } from "react";
import {
  useAssignUserPermissionsMutation,
  useGetUserPermissionsQuery,
} from "@/store/api";
import PermissionGroupAccordion from "@/components/permissions/PermissionGroupAccordion";
import Button from "@/components/common/Button";
import Card from "@/ui/Card";
import CardHeader from "@/ui/CardHeader";
import CardBody from "@/ui/CardBody";

type Props = {
  userId: number;
  onClose: () => void;
};

export default function UserPermissionModal({ userId, onClose }: Props) {
  const { data, isLoading } = useGetUserPermissionsQuery(userId);
  const [assignPermissions] = useAssignUserPermissionsMutation();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (data?.assigned) {
      setSelectedPermissions(data.assigned);
    }
  }, [data]);

  const handleSave = async () => {
    await assignPermissions({
      id: userId,
      permissions: selectedPermissions,
    }).unwrap();

    onClose();
  };

  if (isLoading || !data) return null;

  return (
    <Card>
      <CardHeader title="Manage User Permissions" />
      <CardBody>
        <PermissionGroupAccordion
          permissions={data.permissions}
          selected={selectedPermissions}
          onChange={setSelectedPermissions}
        />

        <div className="text-end mt-3">
          <Button label="Save" onClick={handleSave} />
          <Button
            label="Cancel"
            variant="secondary"
            className="ms-2"
            onClick={onClose}
          />
        </div>
      </CardBody>
    </Card>
  );
}
