import apiCall from '@/lib/axios';

export interface Permission {
  module: string;
  access: string[];
  _id: string;
}

export interface Role {
  _id: string;
  name: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetRolesResponse {
  status: boolean;
  roles: Role[];
}

export const getAllRoles = async (): Promise<GetRolesResponse> => {
  return await apiCall<GetRolesResponse>(
    'GET',
    'api/role/get-all-roles'
  );
};
