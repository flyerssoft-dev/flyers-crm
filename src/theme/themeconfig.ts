import { ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
  components: {
    Button: {
      algorithm: true,
      fontSize: 14,
      defaultColor: '#7700C7',
      fontFamily: 'Outfit',
    },
    Menu: {
      itemBg: '#FFFFFF',
      itemActiveBg: 'rgba(255, 255, 255, 0.03)',
      itemSelectedBg: 'rgba(255, 255, 255, 0.03)',
      fontFamily: 'Outfit',
      itemSelectedColor: 'rgb(114,46,209)',
    },
    Input: {
      colorBgContainer: 'rgba(255, 255, 255, 1)',
      fontFamily: 'Outfit',
    },
    InputNumber: {
      colorBgContainer: 'rgb(240, 244, 246)',
      fontFamily: 'Outfit',
    },
    Select: {
      colorBgContainer: '',
      fontFamily: 'Outfit',
    },
    Table: {
      headerBg: '#f1f1f1',
      headerColor: '#606060',
      fontWeightStrong: 400,
      fontFamily: 'Outfit',
    },
    Layout: {
      siderBg: 'rgb(54,62,69)',
    },
  },
  token: {
    colorSuccess: '#1cb462',
    colorWarning: '#ffb407',
    colorError: '#ff4b42',
    colorPrimary: '#7700C7',
    fontFamily: 'Outfit',
  },
};
