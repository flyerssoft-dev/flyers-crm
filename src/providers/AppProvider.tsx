import { JSX } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AntdProvider from './AntdProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useQueryClientDefaults } from '@/hooks';

type AppProviderProps = {
  children: React.ReactNode | JSX.Element;
};

const AppProvider = ({ children }: AppProviderProps) => {
  const queryClient = useQueryClientDefaults();
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <AntdProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AntdProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
