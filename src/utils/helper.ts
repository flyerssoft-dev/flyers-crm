import { ActionProps, PermissionsProps } from '@/types/permissions';
import { claimsProps, userPermissionsProps } from '../../src/types/userTypes';

/**
 * Formats permissions data into a tree structure.
 *
 * @param {permissionsProps[]} data - Array of permission objects containing features and actions.
 * @returns {treeAccordion[]} - Formatted tree structure with parent features and their child actions.
 */

export interface TreeAccordionChildren {
  title: string;
  value: string;
  key: string;
  disableCheckbox: boolean;
}

export interface TreeAccordion {
  title: string;
  key: string;
  children: TreeAccordionChildren[];
  disabled: boolean;
}

export const TreeDataFormatter = (data: PermissionsProps[]) => {
  // Map over the permissions data to create a tree structure
  const val = data.map((item, index) => {
    const children: TreeAccordionChildren[] = []; // Array to hold child actions

    // If actions exist for the feature, map and push them as children
    if (item.actions.length > 0) {
      item.actions.map((action: any, i: any) =>
        children.push({
          title: action.name, // Action name as the title
          value: action.feature_action_id, // Unique ID for the action
          key: `${index}-${i}`, // Unique key combining index values
          disableCheckbox: false, // Disable checkbox for actions
        }),
      );
    }

    // Return the feature as a parent node with its children
    return {
      title: item.feature_name, // Feature name as the title
      key: index.toString(), // Unique key for the feature
      children: children, // Child actions
      disabled: false, // Disable the feature
    };
  });
  return val;
};

/**
 * Extracts keys and action data for role-based permissions.
 *
 * @param {treeAccordion[]} allPermissions - Tree structure of all available permissions.
 * @param {permissionsProps[]} rolePermissions - Permissions assigned to a specific role.
 * @returns {object} - Contains checked keys and checked data for role permissions.
 */

export const RolePermissionsKey = (
  allPermissions: TreeAccordion[],
  rolePermissions: PermissionsProps[],
) => {
  const checkedKeys: string[] = []; // Holds keys of selected actions
  const checkedData: ActionProps[] = []; // Holds data of selected actions

  // Iterate over the role permissions to match and retrieve corresponding keys
  rolePermissions.forEach((rolePermission: PermissionsProps) => {
    // Find the matching feature in the tree structure
    const matchedFeature = allPermissions.find(
      (permission: TreeAccordion) => permission.title === rolePermission.feature_name,
    );
    if (matchedFeature) {
      // Match and add actions under the feature
      rolePermission.actions.map((action: ActionProps) => {
        const matchedAction = matchedFeature.children.find(
          (child: TreeAccordionChildren) => child.title === action.name,
        );
        if (matchedAction) {
          checkedData.push(action); // Add action data
          checkedKeys.push(matchedAction.key); // Add the action's key
        }
      });
    }
  });
  return { checkedKeys, checkedData };
};

/**
 * Verifies if a user has the required permissions for a specific action.
 *
 * @param {claimsProps} claims - The feature and action the user is trying to access.
 * @param {userPermissionsProps[]} permissions - List of permissions assigned to the user.
 * @returns {boolean} - Returns true if the user has the required permissions, false otherwise.
 */

export const CheckPermissions = (claims: claimsProps, permissions: userPermissionsProps[]) => {
  let hasPermissions;
  // Check each permission to see if it matches the claim
  permissions?.forEach((permission: userPermissionsProps) => {
    if (permission.feature === claims.feature) {
      if (permission.actions.includes(claims.action)) {
        hasPermissions = true;
      } else {
        hasPermissions = false;
      }
    }
  });

  return hasPermissions;
};
