import { Pool, types } from 'pg';
import DbConfigurationInstance from './DbConfiguration';
import UtilInstance from './Util';

const connectionString = DbConfigurationInstance.getConnectionStringPostgres();

// Ajuste de parsers globales: se ejecuta una única vez por proceso.
types.setTypeParser(types.builtins.INT8, UtilInstance.parseInteger);
types.setTypeParser(types.builtins.TIMESTAMP, UtilInstance.noParse);
types.setTypeParser(types.builtins.DATE, UtilInstance.noParse);

const defaultPool = new Pool({
    connectionString,
    max: 40,
    idleTimeoutMillis: 30_000, // Tiempo máximo de inactividad de una conexión
    connectionTimeoutMillis: 5_000, // Tiempo máximo para obtener una conexión del pool 
});

const transactionPool = new Pool({
    connectionString,
    max: 10,
});

export const getPool = (isTransactions = false): Pool => (isTransactions ? transactionPool : defaultPool);

export const closePools = async (): Promise<void> => {
    await Promise.all([
        defaultPool.end().catch(() => undefined),
        transactionPool.end().catch(() => undefined),
    ]);
};

export default defaultPool;