import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="App App-header">
      <Outlet />
    </main>
  );
};

export default Layout;
