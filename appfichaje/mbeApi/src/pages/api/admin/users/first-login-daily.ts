import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import MiddlewareInstance from '@/api/helpers/Middleware'
import UtilInstance from '@/api/helpers/Util'
import UserFirstLoginBusiness from '@/api/business/UserFirstLoginBusiness'
import { IErrorResponse } from '@/api/modelsextra/IErrorResponse'
import { IUserFirstLogin } from '@/api/modelsextra/IUserFirstLogin'

type DailyFirstLoginResponse = {
      data: Array<IUserFirstLogin>
      appliedDate: string
      total: number
}

const resolveDate = (date?: string | null): string => {
      const isoPattern = /^\d{4}-\d{2}-\d{2}$/
      if (date && isoPattern.test(date)) {
            const parsed = new Date(`${date}T00:00:00Z`)
            if (!Number.isNaN(parsed.getTime())) {
                  return date
            }
      }

      return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())
}

const handler = nc(
      {
            onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
                  console.error(err.stack)
                  res.status(500).end('Something broke!')
            },
            onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
                  res.status(404).end('Page is not found')
            }
      })
      .use(MiddlewareInstance.verifyToken)
      .get(async (req, res: NextApiResponse<DailyFirstLoginResponse | IErrorResponse>) => {
            UtilInstance.getDataRequest(req)
            const dateQuery = Array.isArray(req.query.date) ? req.query.date[0] : req.query.date
            const appliedDate = resolveDate(dateQuery || undefined)

            const business = new UserFirstLoginBusiness()
            const dataDB = await business.getByDate(appliedDate)

            if (!dataDB) {
                  res.status(200).json({ data: [], appliedDate, total: 0 })
                  return
            }

            if ((dataDB as IErrorResponse).error) {
                  const error = dataDB as IErrorResponse
                  const status = error.code === 403 ? 403 : 400
                  res.status(status).json(error)
                  return
            }

            const registros = dataDB as Array<IUserFirstLogin>
            res.status(200).json({ data: registros, appliedDate, total: registros.length })
      })

export default handler
