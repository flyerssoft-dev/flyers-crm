import { Actions, Features } from '@enum/index';
import { UserRoleType } from '@feature/auth/enum/UserRoleType.enum';

export type userRoleProps =
  | UserRoleType.HR_ADMIN
  | UserRoleType.EMPLOYEE
  | UserRoleType.MANAGER
  | UserRoleType.IT_ADMIN
  | UserRoleType.IT_EMPLOYEE
  | UserRoleType.MENTOR
  | UserRoleType.TEAM_LEAD
  | UserRoleType.PROJECT_MANAGEMENT
  | UserRoleType.IT_MANAGER
  | UserRoleType.SUPER_ADMIN
  | UserRoleType.OPERATIONS_MANAGER
  | UserRoleType.DESIGN_TEAM_LEAD;

export interface companyDetailsType {
  id: string;
  organization_id: string | null;
  company_name: string | null;
  company_address: string | null;
  company_location: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  prefix: string | null;
  number_format: number | null;
}

export type userDataProps = {
  id: string;
  display_name: string;
  role: string[];
  email: string;
  Role: any;
  employee_id: string;
  job_title: string;
  reporting_person: string;
  date_of_joining: string;
  department?: string;
  reporting_person_role?: string | string[] | null;
  employee_gender: string;
  user_role_permissions?: userRolePermissionsProps;
  company?: companyDetailsType[];
  employee_status?: boolean | null;
};

export type userPermissionsProps = {
  feature: Features;
  actions: Actions[];
};

export type userRolePermissionsProps = {
  role: string;
  permissions: userPermissionsProps[];
};

export interface claimsProps {
  feature: Features;
  action: Actions;
}
