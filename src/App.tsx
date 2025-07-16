import AppProvider from './providers/AppProvider';
import { AppRoutes } from './routes/index';

function App() {
  return (
    <>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </>
  );
}

export default App;
