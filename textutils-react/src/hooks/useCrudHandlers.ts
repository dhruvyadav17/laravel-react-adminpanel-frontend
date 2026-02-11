type MutationFn = (arg: any) => any;

type CrudConfig = {
  create?: MutationFn;
  update?: MutationFn;
  remove?: MutationFn;
};

export function useCrudHandlers(config: CrudConfig) {
  const create = async (data: any) => {
    if (!config.create) return;
    return config.create(data).unwrap();
  };

  const update = async (id: number, data: any) => {
    if (!config.update) return;
    return config.update({ id, ...data }).unwrap();
  };

  const remove = async (id: number) => {
    if (!config.remove) return;
    return config.remove(id).unwrap();
  };

  return { create, update, remove };
}
