import { driver_table } from "../utils/dbfunctions";

export default class Driver {
  constructor(
    public first_name: string,
    public last_name: string,
    public phone_number: string,
    public gender: string,
    public email_address: string,
    public licence_number: string,
    public status: string,
    public id_number: number,
    public password: string
  ) {}
  static getDriverTableCreationSql() {
    return `CREATE TABLE IF NOT EXISTS ${driver_table} (
            driver_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255),
            phone_number VARCHAR(255) UNIQUE,
            gender VARCHAR(255),
            email_address VARCHAR(255) UNIQUE,
            licence_number VARCHAR(255) UNIQUE,
            status VARCHAR(255),
            id_number VARCHAR(255) UNIQUE,
            password TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
  }
  getAddDriverSql() {
    return `INSERT INTO ${driver_table}(first_name,last_name,phone_number,gender,email_address,licence_number,status,id_number,password)\
        VALUES('${this.first_name}', '${this.last_name}', '${this.phone_number}', '${this.gender}', '${this.email_address}','${this.licence_number}','${this.status}', '${this.id_number}','${this.password}')`;
  }
  static getAllDriversSql() {
    return `SELECT * FROM ${driver_table}`;
  }
  static getDriverByIdSql(driver_id: any) {
    return `SELECT * FROM ${driver_table} WHERE driver_id= ${driver_id}`;
  }
  static getDriverDeleteByIdSql(driver_id: string) {
    return `DELETE FROM ${driver_table} WHERE driver_id=${driver_id}`;
  }
}
