
import DbConnection from '../api/helpers/DbConnection';

/**
 * Cambia el estado del usuario a -1 (baja) según su id.
 * @param userId id del usuario
 * @returns true si se actualizó correctamente, false si hubo error
 */
export async function setUserStatusToInactive(userId: number): Promise<boolean> {
	const client = new DbConnection(false);
	const queryData = {
		name: 'set-user-inactive',
		text: 'UPDATE tbl_usuario SET estado = -1 WHERE id = $1 RETURNING *',
		values: [userId]
	};
	try {
		const result: any = await client.exeQuery(queryData);
		// Para PostgreSQL y exeQuery, el resultado es un array
		if (result && Array.isArray(result) && result.length > 0 && !result[0].error) {
			return true;
		}
		return false;
	} catch (error) {
		console.error('Error actualizando estado del usuario:', error);
		return false;
	}
}
