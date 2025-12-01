import apiCall from '@/lib/axios';
export async function getRoleById(id: string | undefined) {
  const response = await apiCall<{ roles: any[] }>(
    'GET',
    'api/role/get-all-roles'
  );
  const matchedRole = response.roles.find((role) => role._id === id);
  if (!matchedRole) {
    throw new Error('Role not found');
  }
  return matchedRole;
}