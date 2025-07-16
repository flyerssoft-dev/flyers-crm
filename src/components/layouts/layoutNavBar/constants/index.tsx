import { ProfileNewIcon, TicketIcon } from '@assets/icons/index';
import { Actions, Features } from '@enum/index';

export const MenuData = () => {
  const Menus = [
    {
      id: 1,
      title: 'Overview',
      activeIcon: <ProfileNewIcon fill="white" />,
      icon: <ProfileNewIcon fill="grayText" />,
      path: '/overview',
      credential: {
        feature: Features.BOARD,
        action: Actions.READ,
      },
    }
  ];
  return Menus;
};
