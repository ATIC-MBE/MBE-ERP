import { PoolClient, QueryConfig } from 'pg';
import type { Pool } from 'pg';
import UtilInstance from './Util';
import { IModel } from './IModel';
import { IErrorSql } from '../modelsextra/IErrorSql';
import { IErrorResponse } from '../modelsextra/IErrorResponse';
import { getPool } from './dbPool';

class DbConnection {
      private readonly _pool: Pool

      constructor( public isTransactions: boolean = false ) {
            this._pool = getPool(isTransactions)
      }

      /**
       * Para insertar registros en varias tablas dependientes
       * @param callback 
       * @returns 
       */
      public async execQueryPool(callback: (client: PoolClient) => Promise<Array<IModel | IErrorResponse>>): Promise<Array<IModel | IErrorResponse>> {
            let dataDB: Array<IModel | IErrorResponse> = []
            const client = await this._pool.connect()
            try {
                        await client.query('BEGIN')
                  try {
                        dataDB = await callback(client)
                        await client.query('COMMIT')
                        //// establecer un error forzando un rollback 
                  } catch (err) {
                        await client.query('ROLLBACK')
                        console.log('ERROR SQL (transacción):', err);
                        let _dataError = err
                        try{
                              let _tmp = (err as Error).cause
                              if ( _tmp ) _dataError = { ..._tmp }
                        }catch(e){}
                        
                        let errorCustom: IErrorSql = _dataError as IErrorSql
                        let errorDB = UtilInstance.getErrorSql(errorCustom.code, errorCustom.detail, errorCustom.msg)
                        if ( errorDB ) dataDB = [ { error: 'Error sql', data: [ errorDB ] } ]
                        else dataDB = [ { error: 'Error sql-pool desconocido!', data: [] } ]
                  }
            } finally {
                  client.release()
            }

            return dataDB
      }

      /**
       * Consultas y hacer insert en una sola tabla
       * @param query 
       * @returns 
       */
      async exeQuery(query: QueryConfig): Promise<Array<IModel | IErrorResponse>> {
            let dataDB: Array<IModel | IErrorResponse> = []
            const client = await this._pool.connect().catch(err => {
                  console.log('Connection error!!')
                  dataDB = [ { error: 'Error connection sql!', data: [] } ]
                  throw err
            })

            if (!client) {
                  return dataDB
            }

            try {
                  const result = await client.query(query)
                  dataDB = [ ...result.rows ]
            } catch (err) {
                  console.log('ERROR SQL:', err);
                  let errorCustom: IErrorSql = err as IErrorSql
                  let errorDB = UtilInstance.getErrorSql(errorCustom.code, errorCustom.detail)
                  if ( errorDB ) dataDB = [ { error: 'Error sql', data: [ errorDB ] } ]
                  else dataDB = [ { error: 'Error sql desconocido!', data: [] } ]
            } finally {
                  client.release()
            }

            return dataDB
      }
}

export default DbConnection