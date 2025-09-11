class DbConfiguration {
      private _isDev
      constructor() {
            this._isDev = process.argv.slice(2)[0] === 'dev'
      }

      getConnectionStringPostgres(): string {
            let [user, password, host, port, db] = (this._isDev) 
                                                      ? [   process.env.POSTGRES_DEV_USER,
                                                            process.env.POSTGRES_DEV_PASSWORD,
                                                            process.env.POSTGRES_DEV_HOST,
                                                            process.env.POSTGRES_DEV_PORT,
                                                            process.env.POSTGRES_DEV_DB ]
                                                      : [
                                                            process.env.POSTGRES_PROD_USER,
                                                            process.env.POSTGRES_PROD_PASSWORD,
                                                            process.env.POSTGRES_PROD_HOST,
                                                            process.env.POSTGRES_PROD_PORT,
                                                            process.env.POSTGRES_PROD_DB
                                                      ]
            return `postgres://${user}:${password}@${host}:${port}/${db}`
      }
}

const DbConfigurationInstance = new DbConfiguration()
Object.freeze(DbConfigurationInstance)

export default DbConfigurationInstance