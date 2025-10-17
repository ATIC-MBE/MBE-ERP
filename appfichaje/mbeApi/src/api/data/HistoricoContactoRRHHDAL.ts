import DbConnection from "../helpers/DbConnection";
import { IHistoricoContactoRRHH } from "../models/IHistoricoContactoRRHH";

class HistoricoContactoRRHHDAL {
  async getByContacto(id_contacto: number): Promise<IHistoricoContactoRRHH[]> {
    const result = await new DbConnection().exeQuery({
            text: 'SELECT * FROM tbl_historico_contactos_rrhh WHERE id_contacto = $1 ORDER BY fecha DESC',
            values: [id_contacto]
    });
    return result as IHistoricoContactoRRHH[];
  }

  async insert(data: IHistoricoContactoRRHH): Promise<IHistoricoContactoRRHH | null> {
    const result = await new DbConnection().exeQuery({
      text: `INSERT INTO tbl_historico_contactos_rrhh (
            id_contacto, usuario, fecha, universidad, tipo, puesto, nota_personal,
            nombre, apellido, telefono, email, historico, ultima_llamada, ultima_actualizacion,
            myd, ade, rrhh, aca, atic, estado_ofertas, portal_web, usuario_portal, 
            clave, firma_convenio_fecha, notas_ofertas, anexos, convocatorias
      ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13, $14,
            $15, $16, $17, $18, $19, $20, $21, $22,
            $23, $24, $25, $26, $27
      ) RETURNING *`,
      values: [
            data.id_contacto, data.usuario, data.fecha, data.universidad, data.tipo, data.puesto, data.nota_personal,
            data.nombre, data.apellido, data.telefono, data.email, data.historico, data.ultima_llamada, data.ultima_actualizacion,
            data.myd, data.ade, data.rrhh, data.aca, data.atic, data.estado_ofertas, data.portal_web, data.usuario_portal,
            data.clave, data.firma_convenio_fecha, data.notas_ofertas, data.anexos, data.convocatorias
      ]
    });
    return (result && result.length > 0) ? (result[0] as IHistoricoContactoRRHH) : null;
  }
}

export default new HistoricoContactoRRHHDAL();
