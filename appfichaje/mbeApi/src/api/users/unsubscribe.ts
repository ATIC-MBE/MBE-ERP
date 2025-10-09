// Endpoint para dar de baja usuario en el backend (mbeApi)
// Ubicación sugerida: src/api/users/unsubscribe.ts

import { setUserStatusToInactive } from '../../services/userService';

export default async function handler(req, res) {
  console.log('Petición recibida:', req.method, req.body); // <-- log para depuración
  if (req.method === 'POST') {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Falta el id de usuario' });
    }
    const success = await setUserStatusToInactive(id);
    res.status(200).json({ success });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}