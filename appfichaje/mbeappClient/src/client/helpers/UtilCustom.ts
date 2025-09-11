
class UtilCustom {
      /**
       * Calcula la diferencia en horas y minutos entre dos fechas con hora (YYYY-MM-DD HH:mm:ss)
       * @param fechaHoraInicio string formato 'YYYY-MM-DD HH:mm:ss'
       * @param fechaHoraFin string formato 'YYYY-MM-DD HH:mm:ss'
       * @returns { h: number, m: number }
       */
      getHoursMinDiff(fechaHoraInicio: string, fechaHoraFin: string): { h: number, m: number } {
            try {
                  const inicio = new Date(fechaHoraInicio.replace(' ', 'T'));
                  const fin = new Date(fechaHoraFin.replace(' ', 'T'));
                  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return { h: 0, m: 0 };
                  let diffMs = Math.abs(fin.getTime() - inicio.getTime());
                  let h = Math.floor(diffMs / (1000 * 60 * 60));
                  let m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  return { h, m };
            } catch {
                  return { h: 0, m: 0 };
            }
      }
      getDateCurrentString(dCurrent = new Date()) {
            try {
                  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Europe/Madrid' }).format(dCurrent);
            } catch (err) {
                  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Europe/Madrid' }).format(new Date());
            }
      }

      /**
       * Calcula la diferencia entre dos fechas (YYYY-MM-DD) y retorna { dias, meses, anos }
       */
      dateCalculator(fechaInicio: string, fechaFin: string): { dias: string, meses: string, anos: string } {
            try {
                  const d1 = new Date(fechaInicio);
                  const d2 = new Date(fechaFin);
                  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return { dias: '0', meses: '0', anos: '0' };

                  let anos = d2.getFullYear() - d1.getFullYear();
                  let meses = d2.getMonth() - d1.getMonth();
                  let dias = d2.getDate() - d1.getDate();

                  if (dias < 0) {
                        meses--;
                        dias += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
                  }
                  if (meses < 0) {
                        anos--;
                        meses += 12;
                  }
                  // Total días
                  const diffTime = Math.abs(d2.getTime() - d1.getTime());
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                  return {
                        dias: diffDays.toString(),
                        meses: meses.toString(),
                        anos: anos.toString()
                  };
            } catch {
                  return { dias: '0', meses: '0', anos: '0' };
            }
      }
}

const UtilCustomInstance = new UtilCustom();
export default UtilCustomInstance;
