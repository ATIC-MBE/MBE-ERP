import DbConnection from "../helpers/DbConnection";
import { IContactoUniversidad } from "../models/IContactoUniversidad";

function toNullIfEmpty(val: any) {
  return val === '' ? null : val;
}

class ContactoUniversidadDAL {
  async getAll(): Promise<IContactoUniversidad[]> {
    const result = await new DbConnection().exeQuery({
      text: 'SELECT * FROM tbl_contacto_universidad ORDER BY id DESC',
      values: []
    });
    return result as IContactoUniversidad[];
  }

  async getById(id: number): Promise<IContactoUniversidad | null> {
    const result = await new DbConnection().exeQuery({
      text: 'SELECT * FROM tbl_contacto_universidad WHERE id = $1',
      values: [id]
    });
    return (result && result.length > 0) ? (result[0] as IContactoUniversidad) : null;
  }

  async insert(data: IContactoUniversidad): Promise<IContactoUniversidad | null> {
    console.log('DAL insert - datos recibidos:', JSON.stringify(data, null, 2));
    
    // Verificar campos obligatorios
    if (!data.nombre || !data.universidad) {
      console.error('DAL insert - campos obligatorios faltantes:', { nombre: data.nombre, universidad: data.universidad });
      throw new Error('Campos obligatorios faltantes: nombre y universidad son requeridos');
    }
    
    try {
      const result = await new DbConnection().exeQuery({
        text: `INSERT INTO tbl_contacto_universidad
        (universidad, tipo, puesto, nota_personal, nombre, apellido, telefono, email, historico, ultima_llamada, ultima_actualizacion, myd, ade, rrhh, aca, atic, estado_ofertas, portal_web, usuario_portal, clave, firma_convenio_fecha, notas_ofertas, anexos, convocatorias)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
        RETURNING *`,
        values: [
          data.universidad, data.tipo, data.puesto, data.nota_personal, data.nombre, data.apellido, data.telefono, data.email, data.historico,
          toNullIfEmpty(data.ultima_llamada),
          toNullIfEmpty(data.ultima_actualizacion),
          data.myd, data.ade, data.rrhh, data.aca, data.atic, data.estado_ofertas, data.portal_web, data.usuario_portal, data.clave,
          toNullIfEmpty(data.firma_convenio_fecha),
          data.notas_ofertas, data.anexos, data.convocatorias
        ]
      });
      console.log('DAL insert - resultado:', result);
      return (result && result.length > 0) ? (result[0] as IContactoUniversidad) : null;
    } catch (error) {
      console.error('DAL insert - error:', error);
      throw error;
    }
  }

  async update(id: number, data: IContactoUniversidad): Promise<IContactoUniversidad | null> {
    const result = await new DbConnection().exeQuery({
      text: `UPDATE tbl_contacto_universidad SET
        universidad=$1, tipo=$2, puesto=$3, nota_personal=$4, nombre=$5, apellido=$6, telefono=$7, email=$8, historico=$9, 
        ultima_llamada=$10, ultima_actualizacion=$11, myd=$12, ade=$13, rrhh=$14, aca=$15, atic=$16, estado_ofertas=$17, 
        portal_web=$18, usuario_portal=$19, clave=$20, firma_convenio_fecha=$21, notas_ofertas=$22, anexos=$23, convocatorias=$24
      WHERE id=$25 RETURNING *`,
      values: [
        data.universidad, data.tipo, data.puesto, data.nota_personal, data.nombre, data.apellido, data.telefono, data.email, data.historico,
        toNullIfEmpty(data.ultima_llamada),
        toNullIfEmpty(data.ultima_actualizacion),
        data.myd, data.ade, data.rrhh, data.aca, data.atic, data.estado_ofertas, data.portal_web, data.usuario_portal, data.clave,
        toNullIfEmpty(data.firma_convenio_fecha),
        data.notas_ofertas, data.anexos, data.convocatorias,
        id
      ]  
    });
    return (result && result.length > 0) ? (result[0] as IContactoUniversidad) : null;
  }

  async delete(id: number): Promise<void> {
    await new DbConnection().exeQuery({
      text: 'DELETE FROM tbl_contacto_universidad WHERE id = $1',
      values: [id]
    });
  }
}

export default new ContactoUniversidadDAL();
