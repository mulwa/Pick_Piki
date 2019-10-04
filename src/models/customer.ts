import { customer_table } from "../utils/dbfunctions";

export default class Customer {
  constructor(
    public first_name: string,
    public last_name: string,
    public email_address: string,
    public phone_number: string,
    public password: string
  ) {}

  addcustomerSql() {
    return `INSERT INTO ${customer_table}(first_name,last_name,email_address,phone_number,password)\
        VALUES('${this.first_name}','${this.last_name}','${this.email_address}','${this.phone_number}','${this.password}')`;
  }

  static createCustomerTableSql() {
    return `CREATE TABLE IF NOT EXISTS ${customer_table} (
            customer_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email_address VARCHAR(255),
            phone_number VARCHAR(255),
            password VARCHAR(255),            
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
  }
  static getAllCustomersSql() {
    return `SELECT * FROM ${customer_table}`;
  }
  static getCustomerById(customer_id: string) {
    return `SELECT * FROM ${customer_table} WHERE customer_id=${customer_id}`;
  }
  static getDeleteCustomerById(customer_id: string) {
    return `DELETE  FROM ${customer_table} WHERE customer_id='${customer_id}'`;
  }
}
