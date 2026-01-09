import { useState } from "react";
import SecurityPage from "../pages/EmployeePage";
import AdminPage from "../pages/AdminPage";
import VisitorDetailModal from "./VisitorDetailModal";
import { useSelector, useDispatch } from "react-redux"

export default function SystemBlueprint() {
    const toggleValue = useSelector((state) => state.visitorDetail.value);
    const [selectedRole, setSelectedRole] = useState('login');

    return (
        <div className="min-h-screen bg-gray-50 p-8 text-gray-800 font-mono">
            <div className="max-w-7xl mx-auto">

                {/* Login Page
        {selectedRole === 'login' && (
          <LoginPage onRoleSelect={setSelectedRole} />
        )} */}

                {/* Security Page */}
                {selectedRole === 'security' && (
                    <SecurityPage
                        onLogout={() => setSelectedRole('login')}
                        onSwitchToAdmin={() => setSelectedRole('admin')}
                    />
                )}

                {/* Admin Page */}
                {selectedRole === 'admin' && (
                    <AdminPage
                        onLogout={() => setSelectedRole('login')}
                        onSwitchToSecurity={() => setSelectedRole('security')}
                        onViewVisitor={() => setShowVisitorDetail(true)}
                    />
                )}

                {/* Visitor Detail Modal */}
                {toggleValue && (
                    <VisitorDetailModal />
                )}

            </div>
        </div>
    );
}