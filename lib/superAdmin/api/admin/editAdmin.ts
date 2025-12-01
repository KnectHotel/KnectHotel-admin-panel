import apiCall from '@/lib/axios';

export async function editAdmin(id: string, data: any) {
  return await apiCall('PUT', `api/employee/${id}`, data);
}
