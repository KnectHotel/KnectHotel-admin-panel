




















































































































































































































































































'use client';
import React, { useEffect, useState } from 'react';
import RolesAndPermissionsModal from '@/components/shared/role-and-permission/role-permission';
import { RiEditBoxLine } from 'react-icons/ri';
import { FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';
import plusIcon from '../../../../../public/assets/plus.png';
import apiCall from '@/lib/axios';
import Navbar from '@/components/Navbar';
import { ToastAtTopRight } from '@/lib/sweetalert';
import { AlertModal } from '@/components/modal/alert-modal';

interface PermissionWithAccess {
  module: string;
  access: string[];
}

const RolesAndPermissionsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rolesAndPermissions, setRolesAndPermissions] = useState<
    Record<string, PermissionWithAccess[]>
  >({});
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleIds, setRoleIds] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const reverseMapModuleName = (uiModule: string): string => {
    const reverseMap: Record<string, string> = {
      'Hotel Management': 'hotel-management',
      'Complaint Management': 'complaint-management',
      'Admin Management': 'admin-management',
      'Guest Management': 'guest-management',
      Dashboard: 'dashboard',
      'Roles and Permissions': 'roles-and-permissions',
      'Payment Management': 'payment-management',
      'Coupons Management': 'coupons-management',
      'Refunds Management': 'refund-management',
      'Roles & Permissions': 'roles-and-permissions',
      'Analytics Reports': 'analytics-reports',
      'Subscription Management': 'subscription-management'
    };
    return reverseMap[uiModule] || uiModule.toLowerCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiCall('GET', 'api/role/get-all-roles');
        const allRoles = response.roles;

        const formatted: Record<string, PermissionWithAccess[]> = {};
        const idsMap: Record<string, string> = {};

        allRoles?.forEach((role: any) => {
          idsMap[role.name] = role._id || role.id || '';
          formatted[role.name] = role.permissions.map((p: any) => ({
            module: p.module
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (l: string) => l.toUpperCase()),
            access: p.access || []
          }));
        });

        setRolesAndPermissions(formatted);
        setRoleIds(idsMap);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    };

    fetchRoles();
  }, []);

  const handleSave = async (
    newRoles: Record<string, PermissionWithAccess[]>
  ) => {
    const roleName = Object.keys(newRoles)[0];
    const selectedModules = newRoles[roleName];

    const permissionsPayload = selectedModules.map(({ module, access }) => ({
      module: reverseMapModuleName(module),
      access
    }));

    const payload = {
      name: roleName,
      scope: 'Platform',
      permissions: permissionsPayload
    };

    try {
      if (editingRole && editingRoleId) {
        await apiCall('PUT', `api/role/update-role/${editingRoleId}`, payload);
        ToastAtTopRight.fire({
          icon: 'success',
          title: 'Role updated successfully'
        });
      } else {
        await apiCall('POST', 'api/role/create-role', payload);
        ToastAtTopRight.fire({
          icon: 'success',
          title: 'Role created successfully'
        });
      }

      const updated = await apiCall('GET', 'api/role/get-all-roles');
      const formatted: Record<string, PermissionWithAccess[]> = {};
      const idsMap: Record<string, string> = {};

      updated.roles?.forEach((role: any) => {
        idsMap[role.name] = role._id || role.id || '';
        formatted[role.name] = role.permissions.map((p: any) => ({
          module: p.module
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
          access: p.access || []
        }));
      });

      setRolesAndPermissions(formatted);
      setRoleIds(idsMap);
      setEditingRole(null);
      setEditingRoleId(null);
      setIsOpen(false);
    } catch (err) {
      ToastAtTopRight.fire({
        icon: 'error',
        title: 'Failed to refresh roles list'
      });
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    const roleId = roleIds[roleToDelete];
    if (!roleId) return;

    try {
      setIsDeleting(true);
      await apiCall('DELETE', `api/role/delete-role/${roleId}`);

      const updated = { ...rolesAndPermissions };
      delete updated[roleToDelete];
      setRolesAndPermissions(updated);

      const updatedIds = { ...roleIds };
      delete updatedIds[roleToDelete];
      setRoleIds(updatedIds);

      ToastAtTopRight.fire({
        icon: 'success',
        title: 'Role deleted successfully'
      });
    } catch (err) {
      ToastAtTopRight.fire({ icon: 'error', title: 'Failed to delete role' });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setRoleToDelete(null);
    }
  };

  const handleEditRole = (role: string) => {
    setEditingRole(role);
    setEditingRoleId(roleIds[role]);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar active={true} search={true} />

      <div className="flex flex-col pt-4 lg:px-8 gap-8 container items-center py-2 text-coffee">
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
          onSave={handleSave}
          isSuperAdmin={true}
          roleId={editingRoleId ?? undefined}
          panelType="super-admin"
        />

        <div className="w-full lg:container">
          <div className="grid grid-cols-12 mb-4 font-bold">
            <div className="col-span-3">Role</div>
            <div className="col-span-7">Permission</div>
            <div className="col-span-2 text-end">Action</div>
          </div>

          {Object.entries(rolesAndPermissions).map(([role, permissions]) => (
            <div key={role} className="grid grid-cols-12 mb-4 items-start">
              <div className="col-span-3">
                <span className="bg-brown text-center text-sm rounded-lg text-white px-3 py-1 font-medium inline-block">
                  {role}
                </span>
              </div>
              <div className="col-span-7">
                <div className="flex flex-wrap gap-2">
                  {permissions.map(({ module }) => (
                    <span
                      key={`${role}-${module}`}
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
                  onClick={() => {
                    setRoleToDelete(role);
                    setShowDeleteModal(true);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
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
