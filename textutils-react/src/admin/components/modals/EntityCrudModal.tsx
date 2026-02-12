import CrudModal from "../../../components/common/CrudModal";
import FormInput from "../../../components/common/FormInput";
import { getModalTitle } from "../../../utils/modalTitle";

type Props = {
  entityName: string;
  modalData: { id?: number; name?: string } | null;
  form: {
    values: { name: string };
    errors: any;
    loading: boolean;
    setField: (field: string, value: any) => void;
    create: () => void;
    update: (id: number) => void;
  };
  onClose: () => void;
};

export default function EntityCrudModal({
  entityName,
  modalData,
  form,
  onClose,
}: Props) {
  const handleSubmit = () => {
    modalData?.id
      ? form.update(modalData.id)
      : form.create();
  };

  return (
    <CrudModal
      title={getModalTitle(entityName, modalData)}
      loading={form.loading}
      onSave={handleSubmit}
      onClose={onClose}
    >
      <FormInput
        label={`${entityName} Name`}
        value={form.values.name}
        error={form.errors?.name?.[0]}
        onChange={(v) => form.setField("name", v)}
        disabled={form.loading}
        required
      />
    </CrudModal>
  );
}
