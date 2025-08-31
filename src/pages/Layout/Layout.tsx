import { Outlet } from 'react-router';
import { NavBar } from './NavBar';
import { Toaster } from '@ui';

export const Layout = () => {
  return (
    <div className="flex flex-col h-full">
      <NavBar />
      <div className="grow-1 p-6 2xl:container 2xl:mx-auto">
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
};
