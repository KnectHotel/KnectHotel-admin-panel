
'use client';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import plusIcon from '../../../../public/assets/plus.png';
import { RiEditBoxLine } from 'react-icons/ri';
import { FaTrashAlt } from 'react-icons/fa';
import RolesAndPermissionsModal from '@/components/shared/role-and-permission/role-permission';
import apiCall from '@/lib/axios';
import { ToastAtTopRight } from '@/lib/sweetalert';
import { AlertModal } from '@/components/modal/alert-modal';

interface PermissionWithAccess {
  module: string;
  access: string[];
}

// Central mapping of API module name -> UI label
const moduleNameMap: Record<string, string> = {
  'dashboard': 'Dashboard',
  'admin-management': 'Employee Management',
  'roles-and-permissions': 'Roles And Permissions',
  'guest-management': 'Guest Management',
  'coupons-management': 'Coupons Management',
  'refund-management': 'Refund Management',
  'complaint-management': 'Complaint Management',
  'payment-management': 'Payment Management',
  'hotel-management': 'Hotel Profile',
  'analytics-reports': 'Analytics Reports',
  'change-password': 'Change Password',
  'service-management': 'Service Management'
};

const getDisplayName = (apiModule: string): string =>
  moduleNameMap[apiModule] || apiModule.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

const getApiModuleName = (displayName: string): string => {
  const reverseMap = Object.entries(moduleNameMap).reduce((acc, [key, val]) => {
    acc[val] = key;
    return acc;
  }, {} as Record<string, string>);
  return reverseMap[displayName] || displayName.toLowerCase().replace(/\s+/g, '-');
};

const RolesAndPermissionsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rolesAndPermissions, setRolesAndPermissions] = useState<Record<string, PermissionWithAccess[]>>({});
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleIds, setRoleIds] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiCall('GET', 'api/role/get-all-roles');
        const allRoles = response.roles;

        const formattedRoles: Record<string, PermissionWithAccess[]> = {};
        const idsMap: Record<string, string> = {};

        allRoles?.forEach((role: any) => {
          idsMap[role.name] = role._id || role.id || '';
          formattedRoles[role.name] = role.permissions.map((p: any) => ({
            module: getDisplayName(p.module),
            access: p.access || []
          }));
        });

        setRolesAndPermissions(formattedRoles);
        setRoleIds(idsMap);
      } catch (err: any) {
        if (err?.response?.data?.message === 'Access denied') {
          setErrorMessage("You don't have access for this module.");
        } else {
          setErrorMessage('Something went wrong while fetching roles.');
        }
      }
    };

    fetchRoles();
  }, []);

  const handleSaveRolesAndPermissions = async (
    newRolesAndPermissions: Record<string, PermissionWithAccess[]>
  ) => {
    try {
      const roleName = Object.keys(newRolesAndPermissions)[0];
      const selectedModules = newRolesAndPermissions[roleName];

      const permissionsPayload = selectedModules.map(({ module }) => ({
        module: getApiModuleName(module),
        access: ['read', 'write', 'delete']
      }));

      const payload = {
        name: roleName,
        scope: 'Hotel',
        permissions: permissionsPayload
      };

      if (editingRole && editingRoleId) {
        await apiCall('PUT', `api/role/update-role/${editingRoleId}`, payload);
        ToastAtTopRight.fire({ icon: 'success', title: 'Role updated successfully' });
      } else {
        try {
          await apiCall('POST', 'api/role/create-role', payload);
          ToastAtTopRight.fire({ icon: 'success', title: 'Role created successfully' });
        } catch (err: any) {
          if (err?.response?.data?.message?.includes('already exists')) {
            ToastAtTopRight.fire({ icon: 'error', title: 'This role is already assigned' });
            return;
          }
          throw err;
        }
      }

      // Refresh UI
      const response = await apiCall('GET', 'api/role/get-all-roles');
      const allRoles = response.roles;

      const formattedRoles: Record<string, PermissionWithAccess[]> = {};
      const idsMap: Record<string, string> = {};

      allRoles?.forEach((role: any) => {
        idsMap[role.name] = role._id || role.id || '';
        formattedRoles[role.name] = role.permissions.map((p: any) => ({
          module: getDisplayName(p.module),
          access: p.access || []
        }));
      });

      setRolesAndPermissions(formattedRoles);
      setRoleIds(idsMap);
      setEditingRole(null);
      setEditingRoleId(null);
      setIsOpen(false);
    } catch (err) {
      ToastAtTopRight.fire({ icon: 'error', title: 'Failed to save changes' });
    }
  };

  // const handleDeleteRole = async (role: string) => {
  //   try {
  //     const roleId = roleIds[role];
  //     if (!roleId) return;

  //     await apiCall('DELETE', `api/role/delete-role/${roleId}`);

  //     const updated = { ...rolesAndPermissions };
  //     delete updated[role];
  //     setRolesAndPermissions(updated);

  //     const updatedIds = { ...roleIds };
  //     delete updatedIds[role];
  //     setRoleIds(updatedIds);

  //     ToastAtTopRight.fire({ icon: 'success', title: 'Role deleted successfully' });
  //   } catch (err) {
  //     ToastAtTopRight.fire({ icon: 'error', title: 'Failed to delete the role.' });
  //   }
  // };
  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    setIsDeleting(true);
    try {
      const roleId = roleIds[roleToDelete];
      if (!roleId) return;

      await apiCall('DELETE', `api/role/delete-role/${roleId}`);

      const updatedRoles = { ...rolesAndPermissions };
      delete updatedRoles[roleToDelete];
      setRolesAndPermissions(updatedRoles);

      const updatedIds = { ...roleIds };
      delete updatedIds[roleToDelete];
      setRoleIds(updatedIds);

      ToastAtTopRight.fire({ icon: 'success', title: 'Role deleted successfully' });
      setShowDeleteModal(false);
    } catch (err) {
      ToastAtTopRight.fire({ icon: 'error', title: 'Failed to delete the role.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteConfirmation = (role: string) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const handleEditRole = async (role: string) => {
    const roleId = roleIds[role];
    if (!roleId) return;

    try {
      const response = await apiCall('GET', `api/role/get-role/${roleId}`);
      const matchedRole = response.role;

      const formattedPermissions: Record<string, PermissionWithAccess[]> = {
        [matchedRole.name]: matchedRole.permissions.map((p: any) => ({
          module: getDisplayName(p.module),
          access: p.access || []
        }))
      };

      setEditingRole(matchedRole.name);
      setEditingRoleId(roleId);
      setIsOpen(true);
    } catch (err) {
      ToastAtTopRight.fire({ icon: 'error', title: 'Failed to fetch role permissions' });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar active={true} search={true} />
      <div className="flex flex-col pt-4 lg:px-8 gap-8 container items-center px-4 py-2 text-coffee">
        {errorMessage ? (
          <div className="text-red-500 text-lg mt-20">{errorMessage}</div>
        ) : (
          <>
            <div className="w-full lg:container flex justify-between mt-20">
              <h2 className="text-lg font-bold">Manage Roles</h2>
              <button
                onClick={() => {
                  setEditingRole(null);
                  setIsOpen(true);
                }}
                className="w-[36px] h-[36px] bg-[#A07D3D] flex items-center justify-center rounded-md hover:opacity-90 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="black"
                  width="28"
                  height="28"
                >
                  <path d="M12 5c.552 0 1 .448 1 1v5h5c.552 0 1 .448 1 1s-.448 1-1 1h-5v5c0 .552-.448 1-1 1s-1-.448-1-1v-5H6c-.552 0-1-.448-1-1s.448-1 1-1h5V6c0-.552.448-1 1-1z" />
                </svg>
              </button>
            </div>

            <RolesAndPermissionsModal
              isOpen={isOpen}
              onClose={() => {
                setIsOpen(false);
                setEditingRole(null);
              }}
              mode={editingRole ? 'edit' : 'add'}
              existingRolesAndPermissions={
                editingRole
                  ? { [editingRole]: rolesAndPermissions[editingRole] }
                  : rolesAndPermissions
              }
              onSave={handleSaveRolesAndPermissions}
              isSuperAdmin={false}
              roleId={editingRoleId ?? undefined}
              panelType="hotel-panel"
            />

            <div className="w-full lg:container">
              <div className="grid grid-cols-12 mb-4 font-bold">
                <div className="col-span-3">Role</div>
                <div className="col-span-7">Permission</div>
                <div className="col-span-2 text-end">Action</div>
              </div>

              {Object.entries(rolesAndPermissions).map(
                ([role, permissions]) => (
                  <div key={role} className="grid grid-cols-12 mb-4 items-start">
                    <div className="col-span-3">
                      <span className="bg-brown text-center text-sm rounded-lg text-white px-3 py-1 font-medium inline-block">
                        {role}
                      </span>
                    </div>
                    <div className="col-span-7">
                      <div className="flex flex-wrap gap-2">
                        {permissions.map(({ module }, index) => (
                          <span
                            key={`${role}-${module}-${index}`}
                            className="bg-brown text-center text-sm rounded-lg text-white px-3 py-1 font-medium inline-block"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-end gap-4">
                      <RiEditBoxLine
                        className="text-brown h-5 w-5 cursor-pointer"
                        onClick={() => handleEditRole(role)}
                      />
                      <FaTrashAlt
                        className="text-brown h-[18px] w-[18px] cursor-pointer"
                        onClick={() => handleDeleteConfirmation(role)}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
      <AlertModal
        isOpen={showDeleteModal}
        onCloseAction={() => {
          setShowDeleteModal(false);
          setRoleToDelete(null);
        }}
        onConfirmAction={handleDeleteRole}
        loading={isDeleting}
        title="Do you want to delete it?"
        description="This action cannot be undone. Are you sure you want to proceed?"
      />
    </div>
  );
};

export default RolesAndPermissionsPage;
