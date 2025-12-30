// src/types/models.ts

export type User = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

export type Role = {
  id: number;
  name: string;
};

export type Permission = {
  id: number;
  name: string;
};
