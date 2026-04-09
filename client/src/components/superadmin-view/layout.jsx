import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "./sidebar";
import SuperAdminHeader from "./header";
import { useState } from "react";

function SuperAdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div
      className="flex min-h-screen w-full"
      style={{ background: "#0a0814" }}
    >
      <SuperAdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        <SuperAdminHeader setOpen={setOpenSidebar} />
        <main
          className="flex-1 p-4 md:p-8"
          style={{ background: "#0f0c29" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
