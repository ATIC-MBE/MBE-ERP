import { serialize } from "cookie";
import { verify } from "jsonwebtoken";

let Day = 60 * 60 * 24
export default function logoutHandler(req: any, res: any) {

    const { session_token } = req.cookies

    if (!session_token) return res.status(401).json({ error: 'no token' })

    try {
        const secret = process.env.SECRET ? process.env.SECRET : 'secret'
        verify(session_token, secret)
        const serialized = serialize('session_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', //SSL en caso de de estar en produccion
            sameSite: 'strict', //Solo peticiones desde el mismo dominio 'strict'
            maxAge: 0,
            path: '/'
        })
        res.setHeader('Set-Cookie', serialized)
        res.status(200).json('logout succesfully')
    } catch (error) {
        res.status(401).json({ error: 'invalid token' })
    }

}