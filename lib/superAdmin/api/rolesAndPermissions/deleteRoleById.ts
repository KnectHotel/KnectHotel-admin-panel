import apiCall from '@/lib/axios';

export async function deleteRoleById(id: string) {
  return await apiCall('DELETE', `api/superAdmin/role/delete-role/${id}`);
}
