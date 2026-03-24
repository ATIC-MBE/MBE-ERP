import { NextApiRequest, NextApiResponse } from "next";
import Constants from "../../../../../api/helpers/Constants"; // Ajusta la ruta si es necesario
import { IErrorResponse } from "../../../../../api/modelsextra/IErrorResponse"; // Ajusta la ruta si es necesario
import { IResponse } from "../../../../../api/modelsextra/IResponse"; // Ajusta la ruta si es necesario
import UserBusiness from "../../../../../api/business/UserBusiness"; // Ajusta la ruta si es necesario
import { StatusDataType } from "../../../../../api/types/GlobalTypes"; // Ajusta la ruta si es necesario
// Importa tu middleware de autenticación/verificación de token si lo utilizas.
// import { runMiddleware } from "../../../../../api/helpers/Middleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse<IResponse>) {
      // 1. Opcional: Validar token / sesión del usuario aquí
      // await runMiddleware(req, res);

      const method = req.method;
      const { id } = req.query; // Captura el ID de la URL
      const { value } = req.body; // Captura el valor (+1 o -1) del body

      // Extraer datos del token (si tienes auth middleware, ajusta esto)
      let _idUserLogin = BigInt(0); 

      // Inicializar el Business (asumiendo StatusDataType de activos)
      const objBusiness = new UserBusiness(_idUserLogin, Constants.code_status_active as StatusDataType, false);

      switch (method) {
            case 'PATCH': // Usamos PATCH porque es una actualización parcial
                  try {
                        const parsedId = parseInt(id as string, 10);
                        const parsedValue = parseInt(value, 10);

                        if (isNaN(parsedId)) {
                              return res.status(400).json({ status: false, data: { error: 'ID de usuario inválido' } });
                        }

                        // Llamar a la lógica de negocio
                        const result = await objBusiness.updatePins(parsedId, parsedValue);

                        // Si devuelve un objeto de error (IErrorResponse)
                        if (typeof result === 'object' && 'error' in result) {
                              return res.status(400).json({ status: false, data: result as IErrorResponse });
                        }

                        // Si fue exitoso (boolean true)
                        if (result === true) {
                              return res.status(200).json({ status: true, message: 'Pins actualizados correctamente' });
                        } else {
                              return res.status(404).json({ status: false, data: { error: 'Usuario no encontrado o no se pudo actualizar' } });
                        }

                  } catch (error: any) {
                        return res.status(500).json({ status: false, data: { error: 'Error interno del servidor', info: error.message } });
                  }
            default:
                  res.setHeader('Allow', ['PATCH']);
                  return res.status(405).json({ status: false, data: { error: `Metodo ${method} no soportado.` } });
      }
}