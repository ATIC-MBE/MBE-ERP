
import { Layout, PropBox } from '../../components/Layout';
import MenuLeftContainer from '../../components/MenuLeftContainer';
import ContactosUniversidadPage from '../rrhh/contactos-universidad';

const menuData = [
  { key: 'inicio', isActive: false, propID: 'Inicio', order: 1, menuPath: '/rrhhmaster', codeIcon: 'home' },
  { key: 'pisos', isActive: false, propID: 'Pisos', order: 2, menuPath: '/rrhhmaster/apartments', codeIcon: 'apartment' },
  { key: 'usuarios', isActive: false, propID: 'Usuarios', order: 3, menuPath: '/rrhhmaster/users', codeIcon: 'user' },
  { key: 'contactos-universidad', isActive: true, propID: 'Universidades', order: 4, menuPath: '/rrhhmaster/contactos-universidad', codeIcon: 'birrete' },
  { key: 'fichaje', isActive: false, propID: 'Fichaje', order: 5, menuPath: '/rrhhmaster/fichaje', codeIcon: 'fichaje' },
  { key: 'esquema', isActive: false, propID: 'Esquema', order: 6, menuPath: '/rrhhmaster/esquema', codeIcon: 'esquema' },
  { key: 'vacaciones', isActive: false, propID: 'Vacaciones', order: 7, menuPath: '/rrhhmaster/vacaciones', codeIcon: 'vacaciones' },
  { key: 'solicitudes', isActive: false, propID: 'Solicitudes', order: 8, menuPath: '/rrhhmaster/solicitudes', codeIcon: 'solicitudes' },
];

export default function ContactosUniversidadMaster() {
  return (
    <div className="flex">
      <MenuLeftContainer data={menuData} itemSelected="contactos-universidad" />
      <div className="flex-1">
        <ContactosUniversidadPage />
      </div>
    </div>
  );
}
