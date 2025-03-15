//import React from "react";
import AppSidebar from "../components/custom/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

const AdminLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <div className="sm:m-10">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
