import { useQuery } from '@tanstack/react-query';
import { employeeData, fetchReportingPersons, fetchTeams } from '@/feature/employee/services';
import { EMPLOYEES_QUERY_KEYS } from '@/feature/assets/constants';

export interface UseEmployeesProps {
  employeesData: {
    currentPage: number;
    pageSize: number;
    filters?: Record<string, string>; // Adjust based on your filter structure
    handleClose?: () => void;
  };
}

export const useEmployees = ({
  employeesData: { currentPage, pageSize, filters },
}: UseEmployeesProps) => {
  const { useEmployees } = EMPLOYEES_QUERY_KEYS;

  // React Query for teams
  const { data: teamOptions, isLoading: isTeamsLoading } = useQuery({
    queryKey: [useEmployees.teams],
    queryFn: fetchTeams,
  });

  // React Query for reporting persons
  const { data: reportingPersonsData, isLoading: isReportingPersonsLoading } = useQuery({
    queryKey: [useEmployees.reportingPersons],
    queryFn: fetchReportingPersons,
  });

  // React Query for employee data
  const { data: employeeResponseData, isLoading } = useQuery({
    queryKey: [useEmployees.employeeData, { currentPage, pageSize, ...filters }],
    queryFn: () => employeeData(currentPage, pageSize, 'desc', filters),
  });

  return {
    teamOptions,
    isTeamsLoading,
    reportingPersonsData,
    isReportingPersonsLoading,
    employeeResponseData,
    isLoading,
  };
};
