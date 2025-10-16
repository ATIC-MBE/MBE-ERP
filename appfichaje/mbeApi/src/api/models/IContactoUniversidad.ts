export interface IContactoUniversidad {
  id?: number;
  universidad: string;
  tipo: string;
  puesto: string;
  nota_personal?: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  historico?: string;
  ultima_llamada?: string; // ISO date
  ultima_actualizacion?: string; // ISO date
  myd?: string;
  ade?: string;
  rrhh?: string;
  aca?: string;
  atic?: string;
  estado_ofertas?: string;
  portal_web?: string;
  usuario_portal?: string;
  clave?: string;
  firma_convenio_fecha?: string; // ISO date
  notas_ofertas?: string;
  anexos?: string;
  convocatorias?: string;
}
