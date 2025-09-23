import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavbarProps {
  userDepartment?: string;
  userRole?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userDepartment, userRole }) => {
  const router = useRouter();

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Fichajes', href: '/fichajes', icon: '⏰' },
    { name: 'Calendario', href: '/calendar', icon: '📅' },
    { name: 'Reportes', href: '/reportes', icon: '📊' },
  ];

  // Elementos solo para administradores
  const adminItems = [
    { name: 'Usuarios', href: '/usuarios', icon: '👥' },
    { name: 'Configuración', href: '/config', icon: '⚙️' },
  ];

  const isAdmin = userRole && ['admin', 'superadmin', 'ceo'].includes(userRole);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">MBE</span>
                <span className="ml-2 text-gray-600">ERP</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    router.pathname === item.href
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}

              {isAdmin && adminItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    router.pathname === item.href
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center">
            {userDepartment && (
              <span className="hidden md:block mr-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {userDepartment.toUpperCase()}
              </span>
            )}

            <div className="relative">
              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="mr-2">👤</span>
                <span className="hidden md:block text-gray-700">{userRole || 'Usuario'}</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                router.pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;