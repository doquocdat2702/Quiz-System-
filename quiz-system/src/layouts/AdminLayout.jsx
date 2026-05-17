import Sidebar from "../components/Sidebar";

function AdminLayout({ children }) {

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 p-8">
        {children}
      </div>

    </div>
  );
}

export default AdminLayout;