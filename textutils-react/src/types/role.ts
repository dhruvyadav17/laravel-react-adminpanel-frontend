export type Role = {
  id: number;
  name: string;
  parent_id?: number | null;
  is_active: boolean;
};
