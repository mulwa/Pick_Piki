import { ride_table } from "../utils/dbfunctions";

export default class Ride {
  constructor(
    public customer_id: Number,
    public driver_id: Number,
    public request_id: Number,
    public amount_charge: Number
  ) {}

  insertRideSql() {
    return `INSERT INTO ${ride_table}(customer_id, driver_id,request_id,amount_charged)
    VALUES('${this.customer_id}','${this.driver_id}','${this.request_id}','${this.amount_charge}')`;
  }
  static createRideTableSql() {
    return `CREATE TABLE IF NOT EXISTS ${ride_table} (
          ride_id INT AUTO INCREMENT PRIMARY KEY,
          customer_id VARCHAR(255) NOT NULL,
          driver_id INT NOT NULL
          request_id INT NOT NULL,
          amount_charged VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      )`;
  }
  static getRideByCustomerIdSql(customer_id: Number) {
    return `SELECT * FROM ${ride_table} WHERE customer_id=${customer_id}`;
  }
  static getRideByDriverIdSql(driver_id: Number) {
    return `SELECT * FROM ${ride_table} WHERE driver_id=${driver_id}`;
  }
  static getRideBetweenDates(startDate: string, endDate: string) {
    return `SELECT * FROM ${ride_table} WHERE created_at BETWEEN CAST('${startDate}' AS DATE) AND CAST('${endDate}' AS DATE);`;
  }
  static getRideByRideId(ride_id: string) {
    return `SELECT * FROM ${ride_table} WHERE driver_id=${ride_id}`;
  }
}
