export function checkIfTableExistsSql(tableName: string) {
  return `show tables like '${tableName}'`;
}
export function checkIfDbExistSql(dbName: string) {
  return `SHOW DATABASES LIKE '${dbName}'`;
}
export function createDb(dbName: string) {
  return `CREATE DATABASE [IF NOT EXISTS] '${dbName}'
  [CHARACTER SET charset_name]
  [COLLATE collation_name]`;
}
export const ride_request_table = "ride_requests";
export const customer_table = "customers";
export const ride_table = "rides";
export const driver_table = "drivers";
export const active_driver_table = "active_drivers";
export const hashSalt = 10;
