import { create } from 'zustand';
import { Permission, Resource, Role, TeamMember } from '../types/permissions';

interface PermissionsState {
  roles: Role[];
  teamMembers: TeamMember[];
  addRole: (role: Role) => void;
  updateRole: (roleId: string, updates: Partial<Role>) => void;
  deleteRole: (roleId: string) => void;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (memberId: string) => void;
  updateRolePermissions: (roleId: string, resource: Resource, permissions: Permission[]) => void;
}

export const usePermissionsStore = create<PermissionsState>((set) => ({
  roles: [
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
  ],
  teamMembers: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: {
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
    },
  ],

  addRole: (role) =>
    set((state) => ({
      roles: [...state.roles, role],
    })),

  updateRole: (roleId, updates) =>
    set((state) => ({
      roles: state.roles.map((role) => (role.id === roleId ? { ...role, ...updates } : role)),
    })),

  deleteRole: (roleId) =>
    set((state) => ({
      roles: state.roles.filter((role) => role.id !== roleId),
    })),

  addTeamMember: (member) =>
    set((state) => ({
      teamMembers: [...state.teamMembers, member],
    })),

  updateTeamMember: (memberId, updates) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((member) =>
        member.id === memberId ? { ...member, ...updates } : member,
      ),
    })),

  deleteTeamMember: (memberId) =>
    set((state) => ({
      teamMembers: state.teamMembers.filter((member) => member.id !== memberId),
    })),

  updateRolePermissions: (roleId, resource, permissions) =>
    set((state) => ({
      roles: state.roles.map((role) => {
        if (role.id === roleId) {
          const updatedPermissions = role.permissions.map((p) =>
            p.resource === resource ? { ...p, permissions } : p,
          );
          return { ...role, permissions: updatedPermissions };
        }
        return role;
      }),
    })),
}));
