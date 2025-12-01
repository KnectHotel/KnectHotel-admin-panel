import apiCall from '@/lib/axios';

export async function getAdminById(id: string | undefined) {
  const response = await apiCall<{ employees: any[] }>(
    'GET',
    'api/employee/'
  );
  const matchedAdmin = response.employees.find((admin) => admin._id === id);
  if (!matchedAdmin) {
    throw new Error('Admin not found');
  }
  return matchedAdmin;
}

export async function getAllAdmins() {
  const response = await apiCall<{ employees: any[] }>(
    'GET',
    'api/employee/'
  );
  const admins = response.employees;
  if (!admins || admins.length === 0) {
    throw new Error('Admin not found');
  }
  return admins;
}
