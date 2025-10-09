import { Client, QueryConfig, types, Pool, PoolClient } from 'pg';
import UtilInstance from './Util';
import { IModel } from './IModel';
import { IErrorSql } from '../modelsextra/IErrorSql';
import { IErrorResponse } from '../modelsextra/IErrorResponse';
import DbConfigurationInstance from './DbConfiguration';

class DbConnection {
      private _connectionString = DbConfigurationInstance.getConnectionStringPostgres()
      private _connection: Client | Pool
      
      constructor( public isTransactions: boolean = false ) {
            // Cambiar el formato de tipo de bigint to int
            types.setTypeParser(types.builtins.INT8, UtilInstance.parseInteger)
            // No cambiar el formato de fecha guardado previamente [TIMESTAMP]
            types.setTypeParser(types.builtins.TIMESTAMP, UtilInstance.noParse)
            // No cambiar el formato de fecha guardado previamente [DATE]
            types.setTypeParser(types.builtins.DATE, UtilInstance.noParse)
            // Create conexion
            this._connection = ( isTransactions ) ? new Pool({connectionString: this._connectionString})
                                                            : new Client({connectionString: this._connectionString})
      }

      /**
       * Para insertar registros en varias tablas dependientes
       * @param callback 
       * @returns 
       */
      public async execQueryPool(callback: (client: PoolClient) => Promise<Array<IModel | IErrorResponse>>): Promise<Array<IModel | IErrorResponse>> {
            let dataDB: Array<IModel | IErrorResponse> = []
            let client = (await this._connection.connect()) as PoolClient
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
            await (
                  this._connection
                  .connect()
                  .then(async () => {
                        await (     this._connection.query(query)
                              .then(result => {
                                    dataDB = [ ...result.rows ]
                              })
                              .catch(err => {
                                    console.log('ERROR SQL:', err);
                                    let errorCustom: IErrorSql = err as IErrorSql
                                    let errorDB = UtilInstance.getErrorSql(errorCustom.code, errorCustom.detail)
                                    // console.log(errorCustom)
                                    if ( errorDB ) dataDB = [ { error: 'Error sql', data: [ errorDB ] } ]
                                    else dataDB = [ { error: 'Error sql desconocido!', data: [] } ]
                              })
                              // .then(() => {
                              //       this._connection.end()
                              // })
                        )
                  })
                  .catch(err => {
                        console.log('Connection error!!')
                        dataDB = [ { error: 'Error connection sql!', data: [] } ]
                  })
            )

            return dataDB
      }
}

export default DbConnection