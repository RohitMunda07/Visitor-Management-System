import React, { useState } from 'react';
import {
  Menu,
  X,
  Home,
  Users,
  UserPlus,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  UserCheck,
  Lock,
  UsersRound
} from 'lucide-react';

export default function Sidebar({ userRole = 'employee', onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Menu items based on user role
  const menuItems = {
    employee: [
      { icon: Home, label: 'Dashboard', path: '/employee/dashboard' },
      { icon: UserPlus, label: 'Request Visitor', path: '/employee/request-visitor' },
      { icon: FileText, label: 'My Requests', path: '/employee/my-requests' },
      { icon: Lock, label: 'Update Password', path: '/employee/update-password' },
      { icon: Settings, label: 'Settings', path: '/employee/settings' },
    ],
    security: [
      { icon: Home, label: 'Dashboard', path: '/security/dashboard' },
      { icon: UserPlus, label: 'Add Visitor', path: '/security/add-visitor' },
      { icon: Users, label: 'All Visitors', path: '/security/all-visitors' },
      { icon: FileText, label: 'Reports', path: '/security/reports' },
      { icon: Lock, label: 'Update Password', path: '/security/update-password' },
      { icon: Settings, label: 'Settings', path: '/security/settings' },
    ],
    hod: [
      { icon: Home, label: 'Dashboard', path: '/hod/dashboard' },
      { icon: UserCheck, label: 'Pending Approvals', path: '/hod/approvals' },
      { icon: Users, label: 'All Visitors', path: '/hod/all-visitors' },
      { icon: FileText, label: 'Reports', path: '/hod/reports' },
      { icon: Lock, label: 'Update Password', path: '/hod/update-password' },
      { icon: Settings, label: 'Settings', path: '/hod/settings' },
    ],
    admin: [
      { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: Users, label: 'All Visitors', path: '/admin/all-visitors' },
      { icon: UsersRound, label: 'All Admin & Security', path: '/admin/users' },
      { icon: Shield, label: 'User Management', path: '/admin/user-management' },
      { icon: FileText, label: 'Reports', path: '/admin/reports' },
      { icon: Lock, label: 'Update Password', path: '/admin/update-password' },
      { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ],
  };

  const currentMenuItems = menuItems[userRole] || menuItems.employee;

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-xl z-40 
            transition-transform duration-300 ease-in-out
             ${isOpen ? 'translate-x-0' : '-translate-x-full'}
             w-full lg:w-64 lg:translate-x-0 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {userRole} Panel
          </h2>
          <p className="text-sm text-gray-500 mt-1">Visitor Management</p>
        </div>

        {/* Menu Items - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {currentMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
              >
                <Icon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </nav>

        {/* Logout Button - Fixed at Bottom */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
