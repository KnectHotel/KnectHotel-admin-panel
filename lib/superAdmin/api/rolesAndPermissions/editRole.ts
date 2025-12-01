import apiCall from '@/lib/axios';

export async function editRole(id: string, data: any) {
  return await apiCall('PUT', `api/superAdmin/role/update-role/${id}`, data);
}
