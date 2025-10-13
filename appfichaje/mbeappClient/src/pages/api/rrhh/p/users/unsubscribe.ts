// Endpoint para dar de baja usuario (cambiar estado a -1)
// Ubicación: src/pages/api/rrhh/p/users/unsubscribe.ts

// Este endpoint reenvía la petición al backend real (mbeApi)
export default async function handler(req, res) {
  console.log('Next.js API unsubscribe llamado:', req.method, req.body); // <-- log de depuración
  if (req.method === 'POST') {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Falta el id de usuario' });
    }
    // Reenvía la petición al backend real
    const backendRes = await fetch('http://185.252.233.57:3002/api/users/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await backendRes.json();
    res.status(200).json(data);
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
