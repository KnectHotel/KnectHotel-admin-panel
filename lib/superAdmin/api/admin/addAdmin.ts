import apiCall from '@/lib/axios';

export async function addAdmin(data: any) {
  return await apiCall('POST', 'api/employee/', data);
}
