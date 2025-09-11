import axios from 'axios';

export const getHistorialContactoUniversidad = async (id: number) => {
  const res = await axios.get(`/api/contactos-universidad?historico=1&id=${id}`);
  return res.data;
};
