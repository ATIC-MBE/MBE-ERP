import type { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import UtilInstance from './Util'
import { IErrorResponse } from '../modelsextra/IErrorResponse'

class Middleware {

      constructor() {}

      verifyToken(req: NextApiRequest, res: NextApiResponse<IErrorResponse>, next: NextHandler): void {            
            let token:string
            if(req.cookies.session_token)
            {
                token = (req.cookies.session_token as string).replace(/['"]+/g, '')
            }
            else{
                if (!req.headers.token) {
                    // 406: NO INTERPRETA SOLICITUD
                    res.status(400).json({ error: 'Send token on headers' })
                    return
              }
              token = (req.headers.token as string).replace(/['"]+/g, '')
            }

            const { status, error, iduser, username, roles } = UtilInstance.checkToken(token)
            if ( !status ) {
                  // 401: NO AUTORIZADO, TOKEN CADUCADA
                  res.status(401).json({ error: `${error}` })
                  return
            }
            // Validar que el usuario tiene permisos al request del api
            // const { isOk, filterstatusdb } = UtilInstance.checkAuthorizationAPI(user.api!, req.url!, req.method!)
            const { isOk, filterstatusdb } = UtilInstance.checkAuthorizationAPI(roles, req.url!, req.method!)
            if ( !isOk ) {
                  // 401: PROHIBIDO SIN ACCESO
                  res.status(403).json({ error: `User unauthorized` })
                  return
            }
            req.headers.filterStatus = filterstatusdb.toString()
            // req.headers.iduser = user.id!.toString()
            req.headers.iduser = iduser!.toString()
            req.headers.username = username!.toString()
            
            next()
      }

      validateToken(req: NextApiRequest, res: NextApiResponse<IErrorResponse>, next: NextHandler): void {            
            let token:string
            if(req.cookies.session_token)
            {
                token = (req.cookies.session_token as string).replace(/['"]+/g, '')
            }
            else{
                if (!req.headers.token) {
                    // 406: NO INTERPRETA SOLICITUD
                    res.status(400).json({ error: 'Send token on headers' })
                    return
              }
              token = (req.headers.token as string).replace(/['"]+/g, '')
            }
            req.headers.token = token
            const { status, error, iduser, username, roles, exp } = UtilInstance.checkToken(token)
            if ( !status ) {
                  // 401: NO AUTORIZADO
                  res.status(401).json({ error: `${error}` })
                  return
            }
            req.headers.exp = exp!.toString();
            req.headers.iduser = iduser!.toString()
            req.headers.username = username!.toString()
            
            next()
      }
}

const MiddlewareInstance = new Middleware()
Object.freeze(MiddlewareInstance)

export default MiddlewareInstance