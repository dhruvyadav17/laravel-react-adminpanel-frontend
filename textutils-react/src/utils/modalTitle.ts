type ModalEntity = {
  id?: number | string;
} | null;

export function getModalTitle(
  entityName: string,
  modalData?: ModalEntity
) {
  return modalData?.id
    ? `Edit ${entityName}`
    : `Add ${entityName}`;
}
