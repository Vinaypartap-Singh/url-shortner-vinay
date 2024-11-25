import Header from "@/components/header";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <main className="min-h-screen container max-w-7xl m-auto">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
