

































































































































































































































































































































































































































































































































































































































































































































'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getRoleById } from '../../../lib/superAdmin/api/rolesAndPermissions/getRoleByID';

interface Permission {
  module: string;
  access: string[];
}

interface RoleData {
  name: string;
  permissions: Permission[];
}

interface PermissionWithAccess {
  module: string;
  access: string[];
}

type Mode = 'add' | 'edit' | 'view';
type RolesAndPermissions = Record<string, PermissionWithAccess[]>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: Mode;
  existingRolesAndPermissions?: RolesAndPermissions;
  onSave: (data: RolesAndPermissions) => Promise<void>;
  roleId?: string;
  isSuperAdmin?: boolean;
  panelType: 'super-admin' | 'hotel-panel';
}

const servingDepartmentOptions = [
  { label: 'Reception', value: 'reception' },
  { label: 'Housekeeping', value: 'housekeeping' },
  { label: 'In-Room Dining', value: 'inroomdining' },
  { label: 'Gym / Community / Conference Hall', value: 'gym' },
  { label: 'Spa/Salon', value: 'spa' },
  { label: 'Swimming Pool', value: 'swimmingpool' },
  { label: 'Concierge Service', value: 'conciergeservice' },
  { label: 'In-room Control', value: 'in_room_control' },
  { label: 'Order Management', value: 'ordermanagement' },
  { label: 'SOS MANAGEMENT', value: 'sos' },
  { label: 'CHAT WITH STAFF', value: 'chat' }
];

const capitalizeModule = (module: string) =>
  module
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const moduleMapSuperAdmin: Record<string, string> = {
  'admin-management': 'Admin Management',
  'hotel-management': 'Hotel Management',
  'analytics-reports': 'Analytics Reports',
  'subscription-management': 'Subscription Management',
  'coupons-management': 'Coupons Management',
  'refund-management': 'Refunds Management',
  'complaint-management': 'Complaint Management',
  'payment-management': 'Payment Management',
  'guest-management': 'Guest Management',
  'roles-and-permissions': 'Roles and Permissions',
  dashboard: 'Dashboard'
};

const moduleMapHotelPanel: Record<string, string> = {
  'admin-management': 'Employee Management',
  'hotel-management': 'Hotel Profile',
  'analytics-reports': 'Analytics Reports',
  'coupons-management': 'Coupons Management',
  'refund-management': 'Refunds Management',
  'complaint-management': 'Complaint Management',
  'payment-management': 'Payment Management',
  'guest-management': 'Guest Management'
  
};

const RolesAndPermissionsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  mode = 'add',
  existingRolesAndPermissions = {},
  onSave,
  roleId,
  isSuperAdmin = false,
  panelType
}) => {
  const [role, setRole] = useState<string>('');
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] =
    useState<RolesAndPermissions>(existingRolesAndPermissions);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const prevFetchDepsRef = useRef<string>('');

  const superAdminModules = [
    'Dashboard',
    'Admin Management',
    'Roles and Permissions',
    'Guest Management',
    'Complaint Management',
    'Subscription Management',
    'Coupons Management',
    'Refunds Management',
    
    'Hotel Management',
    
    'Analytics Reports'
  ];

  const hotelModules = [
    'Dashboard',
    'Employee Management',
    
    'Roles And Permissions',
    'Guest Management',
    'Coupons Management',
    'Refund Management',
    'Complaint Management',
    'Payment Management',
    
    'Hotel Profile',
    'Analytics Reports'
  ];

  const availableModules = isSuperAdmin ? superAdminModules : hotelModules;

  const mapModuleName = (
    apiModule: string,
    panelType: 'super-admin' | 'hotel-panel'
  ): string => {
    const map =
      panelType === 'super-admin' ? moduleMapSuperAdmin : moduleMapHotelPanel;
    return map[apiModule.toLowerCase()] || apiModule;
  };

  const fetchRoleData = useCallback(async () => {
    if (!isOpen) {
      setRole('');
      setRoles([]);
      setSelectedPermissions({});
      setSelectedRole(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSuperAdmin && (mode === 'edit' || mode === 'view') && roleId) {
        const matchedRole: RoleData = await getRoleById(roleId);
        const formattedPermissions: RolesAndPermissions = {
          [matchedRole.name]: matchedRole.permissions.map((p) => ({
            module: mapModuleName(p.module, panelType),
            access: p.access || []
          }))
        };

        setRoles([matchedRole.name]);
        setSelectedPermissions(formattedPermissions);
        setSelectedRole(matchedRole.name);
        setRole(matchedRole.name);
      } else if (!isSuperAdmin && (mode === 'edit' || mode === 'view')) {
        const roleKeys = Object.keys(existingRolesAndPermissions);
        setRoles(roleKeys);
        setSelectedPermissions(existingRolesAndPermissions);
        setSelectedRole(roleKeys[0] || null);
        if (roleKeys[0]) setRole(roleKeys[0]);
      }
    } catch (err) {
      setError(
        `Failed to fetch role: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [
    isOpen,
    mode,
    roleId,
    isSuperAdmin,
    existingRolesAndPermissions,
    panelType
  ]);

  useEffect(() => {
    const depsString = JSON.stringify({
      isOpen,
      mode,
      roleId,
      isSuperAdmin,
      existingRolesAndPermissions,
      panelType
    });
    if (depsString === prevFetchDepsRef.current) return;

    fetchRoleData();
    prevFetchDepsRef.current = depsString;
  }, [fetchRoleData]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
    setError(null);
  };

  const handleAddRole = () => {
    if (!role.trim()) {
      setError('Role name cannot be empty!');
      return;
    }
    if (roles.includes(role) && mode === 'add') {
      setError('Role already exists!');
      return;
    }
    if (mode === 'edit' && selectedRole) {
      const updatedPermissions = { ...selectedPermissions };
      const permissions = updatedPermissions[selectedRole] || [];
      delete updatedPermissions[selectedRole];
      updatedPermissions[role] = permissions;
      setSelectedPermissions(updatedPermissions);
      setRoles(Object.keys(updatedPermissions));
      setSelectedRole(role);
    } else {
      setRoles([...roles, role]);
      setSelectedPermissions((prev) => ({ ...prev, [role]: [] }));
      setSelectedRole(role);
    }
    setRole('');
  };

  const handleDeleteRole = (roleToDelete: string) => {
    if (isSuperAdmin) return; 
    const updatedRoles = roles.filter((r) => r !== roleToDelete);
    setRoles(updatedRoles);
    const updatedPermissions = { ...selectedPermissions };
    delete updatedPermissions[roleToDelete];
    setSelectedPermissions(updatedPermissions);
    setSelectedRole(updatedRoles[0] || null);
  };

  const handlePermissionChange = (permission: string) => {
    if (!selectedRole || mode === 'view') return;

    const normalize = (name: string) =>
      name.toLowerCase().replace(/\s+/g, '-').trim();

    setSelectedPermissions((prev) => {
      const rolePermissions = prev[selectedRole] || [];

      const permissionIndex = rolePermissions.findIndex(
        (p) => normalize(p.module) === normalize(permission)
      );

      let updatedPermissions;

      if (permissionIndex !== -1) {
        updatedPermissions = rolePermissions.filter(
          (p) => normalize(p.module) !== normalize(permission)
        );
      } else {
        updatedPermissions = [
          ...rolePermissions,
          { module: permission, access: ['read', 'write', 'delete'] }
        ];
      }

      return { ...prev, [selectedRole]: updatedPermissions };
    });
  };

  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
    if (mode === 'edit') setRole(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(selectedPermissions).length === 0) {
      setError('Please add at least one role!');
      return;
    }

    setLoading(true);
    try {
      const normalizedPermissions: RolesAndPermissions = {};

      Object.entries(selectedPermissions).forEach(([roleName, permissions]) => {
        const updatedPerms: PermissionWithAccess[] = [];

        permissions.forEach((perm) => {
          const normalizedModule =
            servingDepartmentOptions.find(
              (option) => option.value === perm.module
            )?.value || perm.module;

          updatedPerms.push({
            ...perm,
            module: normalizedModule
          });
        });

        normalizedPermissions[roleName] = updatedPerms;
      });

      await onSave(normalizedPermissions);
      onClose();
    } catch (err: any) {
      if (
        err?.response?.data?.message === 'Access denied' ||
        err?.message?.toLowerCase().includes('access denied')
      ) {
        setError("You don't have access to perform this action.");
      } else {
        setError('Failed to save changes');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalSelectedModules = Object.values(selectedPermissions).reduce(
    (sum, perms) => sum + (perms?.length ?? 0),
    0
  );

  const isSubmitDisabled = loading || totalSelectedModules === 0;

  
  
  
  const showRoleNameEditor =
    mode === 'edit' || (mode === 'add' && roles.length === 0);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-[#FAF6EF] rounded-lg shadow-lg px-6 pb-6 pt-4 flex flex-col gap-6 w-full max-w-3xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          aria-label="Close modal"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {mode === 'add' && 'Add New Role'}
          {mode === 'edit' && 'Edit Role'}
          {mode === 'view' && 'View Role'}
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== 'view' && showRoleNameEditor && (
            <div className="flex gap-2 justify-start items-center w-full max-w-md">
              <div className="flex-1">
                <Input
                  id="role"
                  type="text"
                  placeholder="Enter role name"
                  value={role}
                  onChange={handleRoleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRole();
                    }
                  }}
                  className="bg-[#F6EEE0] text-gray-700 px-2 rounded-md border-none"
                  disabled={loading}
                />
              </div>
              {(mode === 'add' || mode === 'edit') && (
                <Button
                  type="button"
                  onClick={handleAddRole}
                  className="bg-[#8c6b33] text-white hover:bg-[#362913] px-4 h-auto rounded-lg"
                  disabled={loading}
                >
                  {mode === 'edit' ? 'Update Role' : 'Add Role'}
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-2 pb-2 overflow-x-auto hide-scrollbar">
            {roles.map((r) => (
              <div key={r} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleRoleClick(r)}
                  className={`relative rounded-md px-3 py-1 hover:text-goldenYellow hover:bg-coffee text-white ${
                    selectedRole === r ? 'bg-coffee' : 'bg-[#8c6b33]'
                  } hover:bg-[#362913] transition-colors`}
                  disabled={loading}
                >
                  {r}
                  {selectedRole === r && (
                    <span
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 
                      border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent 
                      border-t-coffee"
                    />
                  )}
                </button>
                {mode !== 'view' && !isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRole(r)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Delete role ${r}`}
                    disabled={loading}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : selectedRole ? (
            <div className="bg-[#F6EEE0] p-4 rounded-lg">
              <h3 className="font-medium mb-3">
                Permitted modules for:{' '}
                <span className="text-[#8c6b33]">{selectedRole}</span>
              </h3>
              <div className="grid grid-cols-2">
                {}
                <div>
                  {availableModules.map((permission) => (
                    <div
                      key={permission}
                      className="flex text-nowrap items-center space-x-2 mb-3"
                    >
                      <Checkbox
                        id={`permission-${permission}`}
                        checked={
                          selectedRole
                            ? (selectedPermissions[selectedRole] || []).some(
                                (p) =>
                                  p.module.toLowerCase().trim() ===
                                  permission.toLowerCase().trim()
                              )
                            : false
                        }
                        onCheckedChange={() =>
                          handlePermissionChange(permission)
                        }
                        disabled={mode === 'view' || loading}
                      />
                      <label
                        htmlFor={`permission-${permission}`}
                        className="text-sm text-gray-700"
                      >
                        {permission}
                      </label>
                    </div>
                  ))}
                </div>

                {}
                {!isSuperAdmin && (
                  <div className="col-span-1">
                    <h3 className="font-medium mb-3">Service Management</h3>
                    {servingDepartmentOptions.map(({ label, value }) => (
                      <div
                        key={value}
                        className="flex text-nowrap items-center space-x-2 mb-3"
                      >
                        <Checkbox
                          id={`permission-${value}`}
                          checked={
                            selectedRole
                              ? (selectedPermissions[selectedRole] || []).some(
                                  (p) =>
                                    p.module
                                      .toLowerCase()
                                      .replace(/\s+/g, '-') === value
                                )
                              : false
                          }
                          onCheckedChange={() => handlePermissionChange(value)}
                          disabled={mode === 'view' || loading}
                        />
                        <label
                          htmlFor={`permission-${value}`}
                          className="text-sm text-gray-700"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            mode !== 'add' && <p className="text-gray-600">No role selected</p>
          )}

          {mode !== 'view' && (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-primary"
                disabled={isSubmitDisabled}
              >
                {loading
                  ? 'Saving...'
                  : mode === 'edit'
                    ? 'Save Changes'
                    : 'Create'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RolesAndPermissionsModal;
