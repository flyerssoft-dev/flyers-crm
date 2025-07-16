import { Actions, Features } from '@/enum';
import {
  AssetsDashboard,
} from './../feature/Dashboard';

export const appRoutes = [
  {
    path: '/overview',
    element: <AssetsDashboard />,
    credential: {
      feature: Features.ONBOARDING,
      action: Actions.ONBOARDING_IT,
    },
  },
];
