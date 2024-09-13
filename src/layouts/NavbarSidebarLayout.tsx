import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";
import MainContent from "@/layouts/MainContent";
import type { FC, PropsWithChildren } from "react";

const NavbarSidebarLayout: FC<PropsWithChildren> = ({ children }) => (
  <SidebarProvider>
    <Navbar />
    <div className="flex items-start pt-16">
      <Sidebar />
      <MainContent>{children}</MainContent>
    </div>
  </SidebarProvider>
);

export default NavbarSidebarLayout;
