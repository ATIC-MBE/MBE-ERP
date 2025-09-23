import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import DepartmentCalendar from '../components/Calendar/DepartmentCalendar';
import UserContext from '@/client/context/UserContext';

const CalendarPage: React.FC = () => {
  const router = useRouter();
  const { getCurrentRol } = useContext(UserContext);
  const [userDepartment, setUserDepartment] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener información del usuario desde el contexto
    const getUserInfo = () => {
      try {
        const currentRole = getCurrentRol();
        if (currentRole) {
          setUserRole(currentRole);
          // Determinar el departamento basado en el rol
          if (currentRole.includes('rrhh')) {
            setUserDepartment('rrhh');
          } else if (currentRole.includes('atic')) {
            setUserDepartment('atic');
          } else if (currentRole.includes('aca')) {
            setUserDepartment('aca');
          } else if (currentRole.includes('myd')) {
            setUserDepartment('myd');
          } else if (currentRole.includes('ade')) {
            setUserDepartment('ade');
          } else if (currentRole.includes('superadmin')) {
            setUserDepartment('superadmin');
          } else if (currentRole.includes('ceo')) {
            setUserDepartment('ceo');
          } else {
            setUserDepartment('general');
          }
        } else {
          // Si no hay rol, redirigir a login
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Error getting user info:', error);
        router.push('/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, [getCurrentRol, router]);

  // Redirigir si no hay departamento
  useEffect(() => {
    if (!loading && !userDepartment) {
      router.push('/login');
    }
  }, [loading, userDepartment, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando...</span>
      </div>
    );
  }

  if (!userDepartment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso no autorizado
          </h2>
          <p className="text-gray-600 mb-4">
            Debe iniciar sesión para acceder al calendario
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                ERP MBE - Calendario
              </h1>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {userDepartment.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Rol: {userRole}
              </span>
              <button
                onClick={() => router.push(`/${getCurrentRol()}`)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm"
              >
                Volver al ERP
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DepartmentCalendar
          department={userDepartment}
          userRole={userRole}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 MBE ERP - Sistema de Gestión Empresarial</p>
            <p className="mt-1">
              Calendario integrado con Google Calendar
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CalendarPage;