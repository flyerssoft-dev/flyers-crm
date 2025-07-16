import axiosInstance from '@/utils/axiosInstance';
import useAuthStore from '@/feature/auth/store/useAuthStore';
import { userDataProps } from '@/types/userTypes';

interface EmployeeDetailsUserRolePermissions {
  id: string;
  employee_details_id: string;
  role_id: string;
  role: {
    id: string;
    role_name: string;
    role_priority: string | null;
  };
}
interface EmployeeDetailsReportingPerson {
  id: string | null;
  employee_details_id: string | null;
  reporting_manager_id: string | null;
  reporting_person: string | null;
}

export interface EmployeeDetails {
  id: string | null;
  azure_id: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  employee_id: string | null;
  department: string | null;
  email: string | null;
  phone_number: string | null;
  job_title: string | null;
  personal_email: string | null;
  office_location: string | null;
  business_phones: string[] | null;
  preferred_language: string | null;
  date_of_joining: string | null;
  employee_type: string | null;
  image_url: string | null;
  image_url_key: string | null;
  status: string | null;
  projects: any[] | null;
  current_projects: any[] | null;
  temporary_password: string | null;
  permanent_password: string | null;
  is_temporary_password: boolean | null;
  employee_status: string | null;
  user_role_permissions: EmployeeDetailsUserRolePermissions | null;
  reporting_person: EmployeeDetailsReportingPerson | null;
}
export interface EmployeeDetailsApiResponse {
  statusCode: number;
  message: EmployeeDetails[];
  meta: {
    current_page: number | null;
    item_count: number | null;
    total_items: number | null;
    total_pages: number | null;
  };
}

export const getEmployeeDetails = (): Promise<{ data: userDataProps }> => {
  const employeeDetails = axiosInstance.get(`/employeeDetails/me`);
  return employeeDetails;
};

export const getEmployeeProfileImage = async (employeeId: string) => {
  const response = await axiosInstance.get(`/employeeDetails/image/get/${employeeId}`);
  return response.data;
};

export const getProfilePicture = async (azure_id: string) => {
  const response = await axiosInstance.get(`graph-api/profile-pic/${azure_id}`);

  return response?.data;
};

export const fetchTeams = async (): Promise<any[] | undefined> => {
  try {
    // getting companies are common for user data so sending ids from here
    const userData = useAuthStore.getState().userData;
    const companyId = Array.isArray(userData?.company) ? userData.company[0].id : '';
    const { data: response } = await axiosInstance.get(`department/all/${companyId}`);

    return response.data?.map((teamName: string) => ({
      value: teamName,
      label: teamName,
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchReportingPersons = async () => {
  try {
    const { data } = await axiosInstance.get('/department/getAllReportingPersonDetails');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const employeeData = async (
  page?: number,
  limit?: number,
  sort?: string,
  filters?: {
    employee_type?: string;
    search?: string;
    department?: string;
    reporting_manager_id?: string;
    status?: string;
  },
): Promise<EmployeeDetailsApiResponse> => {
  let queryParams = `page=${page}&limit=${limit}&sort=${sort}`;

  if (filters?.search) {
    queryParams += `&search=${filters.search}`;
  }

  if (filters?.employee_type) {
    queryParams += `&employee_type=${filters.employee_type}`;
  }

  if (filters?.department) {
    queryParams += `&department=${filters.department}`;
  }

  if (filters?.reporting_manager_id) {
    queryParams += `&reporting_manager_id=${filters.reporting_manager_id}`;
  }
  if (filters?.status) {
    queryParams += `&status=${filters.status}`;
  }

  const response = await axiosInstance.get(`employeeDetails/getAllEmployeeDetails/?${queryParams}`);
  return response.data;
};
