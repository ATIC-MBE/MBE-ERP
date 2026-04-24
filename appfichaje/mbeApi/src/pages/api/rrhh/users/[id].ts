import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import MiddlewareInstance from '@/api/helpers/Middleware'
import { IErrorResponse } from '@/api/modelsextra/IErrorResponse'
import { IResponse } from '@/api/modelsextra/IResponse'
import { IUser } from '@/api/models/IUser'
import UserBusiness from '@/api/business/UserBusiness'
import UtilInstance from '@/api/helpers/Util'
import { StatusDataType } from '@/api/types/GlobalTypes'

const handler = nc(
      {
            onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
                  console.error(err.stack);
                  res.status(500).end("Something broke!");
            },
            onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
              res.status(404).end("Page is not found");
            }
      })
      .use(MiddlewareInstance.verifyToken)
      
      .get(async (req , res : NextApiResponse <IResponse | IErrorResponse>)=>{
            const {idUserLogin , filterState} = UtilInstance.getDataRequest(req)
            let el : UserBusiness = new UserBusiness(idUserLogin , filterState , false)

            let dataDB : IUser | IErrorResponse = await el.getByIdRRHH_(BigInt(parseInt(req.query.id as string)))

            if(!dataDB){
                  res.status(404).json({ error : 'Data not found'})
                  return
            }
            if (({...dataDB } as IErrorResponse).error){
                  let _d = dataDB as IErrorResponse
                  if(_d.code === 403) res.status(403).json(_d)
                  else res.status(404).json(_d)
                  return
            }
            res.json({data : dataDB})
      })
      
      .patch(async (req: NextApiRequest, res: NextApiResponse<IResponse | IErrorResponse>) => {
    const { idUserLogin, filterState } = UtilInstance.getDataRequest(req);
    let el = new UserBusiness(idUserLogin, filterState, true);

    let usuarioActual = await el.getByIdRRHH_(BigInt(parseInt(req.query.id as string)));
    if (!usuarioActual || (usuarioActual as IErrorResponse).error) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
    }

    const usuarioValido = usuarioActual as IUser;
    // Forzamos que data contenga idrol si viene en el body
    let data: IUser = { 
        ...usuarioValido,
        idrol: req.body.idrol // <--- ASIGNACIÓN DIRECTA
    };

    // Actualizar el resto de campos
    Object.keys(req.body).forEach((key) => {
        if (key in usuarioValido) {
            (data as any)[key] = req.body[key];
        }
    });

    // Validar si idrol sigue siendo nulo tras el mapeo
    if (!data.idrol) {
        // Lógica de rescate: intentar sacar el rol actual de la DB si no se envió uno nuevo
        const query = {
            name: 'get-user-rol',
            text: `SELECT idrol FROM tbl_usuario_x_rol WHERE idusuario = $1 LIMIT 1`,
            values: [parseInt(req.query.id as string)]
        };
        const resultArr = await el.dataAccess.client.exeQuery(query);
        if (resultArr && resultArr[0]) {
            data.idrol = (resultArr[0] as any).idrol;
        } else {
            res.status(409).json({ error: 'El campo idrol es obligatorio y no se encontró uno previo.' });
            return;
        }
    }

    let dataDB: IUser | IErrorResponse = await el.updateRRHH(BigInt(parseInt(req.query.id as string)), data);
    
    if (!dataDB) {
        res.status(204).json({ error: 'data not found' });
        return;
    }
    if ((dataDB as IErrorResponse).error) {
        res.status(409).json(dataDB as IErrorResponse);
        return;
    }
    res.json({ data: dataDB });
})
      .delete(async (req: NextApiRequest, res: NextApiResponse<IResponse | IErrorResponse>) => { 
            const {idUserLogin, filterState} = UtilInstance.getDataRequest(req)
            let el: UserBusiness = new UserBusiness(idUserLogin, filterState, false)
            
            let dataDB: IUser | IErrorResponse = await el.delete(BigInt(parseInt(req.query.id as string)))
            if ( !dataDB ) {
                  res.status(404).json({ error: 'data not found' })
                  return
            }
            if ( ({ ...dataDB } as IErrorResponse).error ) {
                  // No conflicto, verificar el status del error y ver si el usuario puede eliminar el registro
                  res.status(409).json(dataDB as IErrorResponse)
                  return
            }
            res.json({ data: dataDB })
      })

export default handler