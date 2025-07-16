export type Permission = 'create' | 'read' | 'update' | 'delete';
export type Resource = 'assets' | 'issues' | 'team' | 'vendors';

export interface RolePermission {
  resource: Resource;
  permissions: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: RolePermission[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

// Predefined roles
export const PREDEFINED_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all resources',
    permissions: [
      { resource: 'assets', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'issues', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'team', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'vendors', permissions: ['create', 'read', 'update', 'delete'] },
    ],
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage most resources but cannot delete',
    permissions: [
      { resource: 'assets', permissions: ['create', 'read', 'update'] },
      { resource: 'issues', permissions: ['create', 'read', 'update'] },
      { resource: 'team', permissions: ['read', 'update'] },
      { resource: 'vendors', permissions: ['create', 'read', 'update'] },
    ],
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Can only view resources',
    permissions: [
      { resource: 'assets', permissions: ['read'] },
      { resource: 'issues', permissions: ['read'] },
      { resource: 'team', permissions: ['read'] },
      { resource: 'vendors', permissions: ['read'] },
    ],
  },
];

export interface ActionProps {
  feature_action_id: string;
  name: string;
}

export interface PermissionsProps {
  feature_name: string;
  actions: ActionProps[];
}
