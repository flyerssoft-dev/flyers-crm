import { Actions, Features } from '@enum/index';
import { JSX } from 'react';

export interface ChildItem {
  id: number;
  title: string;
  path: string;
  credential: { feature: Features; action: Actions };
}

export type MenuProps = {
  id: number;
  title: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
  path: string;
  credential?: { feature: Features; action?: Actions };
  children?: ChildItem[];
};
