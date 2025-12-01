import apiCall from '@/lib/axios';

export async function addNewRole(data: any) {
  return await apiCall('POST', 'api/superAdmin/role/create-role', data);
}
