
export interface IHistoricoContactoRRHH {
  id?: number;
  id_contacto: number;
  usuario: string;
  fecha: string;
  
  // Campos de la tabla principal
  universidad?: string;
  tipo?: string;
  puesto?: string;
  nota_personal?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  historico?: string;
  ultima_llamada?: string;
  ultima_actualizacion?: string;
  myd?: string;
  ade?: string;
  rrhh?: string;
  aca?: string;
  atic?: string;
  estado_ofertas?: string;
  portal_web?: string;
  usuario_portal?: string;
  clave?: string;
  firma_convenio_fecha?: string;
  notas_ofertas?: string;
  anexos?: string;
  convocatorias?: string;
}
