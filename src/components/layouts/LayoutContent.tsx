import { Outlet } from 'react-router-dom';

const LayoutContent = () => {
  return (
    <div className="w-full h-screen bg-table overflow-auto">
      <Outlet />
    </div>
  );
};

export default LayoutContent;
