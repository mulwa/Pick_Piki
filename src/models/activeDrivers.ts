import { active_driver_table } from "../utils/dbfunctions";

export default class ActiveDriver {
  constructor(
    public driver_id: string,
    public lat: string,
    public lng: string,
    public status: string,
    public updated_at: string
  ) {}

  addDriverActive() {
    return `INSERT INTO ${active_driver_table}(driver_id, lat, lng, status, updated_at)\
        VALUES('${this.driver_id}','${this.lat}','${this.lng}','${this.status}','${this.updated_at}')`;
  }
  updateActiveDriver() {
    return `UPDATE ${active_driver_table} SET lat='${this.lat}', lng='${this.lng}', status='${this.status}', updated_at='${this.updated_at}'\
      WHERE driver_id='${this.driver_id}'`;
  }

  static createActiveDriverTable() {
    return `CREATE TABLE IF NOT EXISTS ${active_driver_table} (
            driver_id INT PRIMARY KEY,
            lat VARCHAR(255),
            lng VARCHAR(255),
            status VARCHAR(255),
            updated_at VARCHAR(255)
        )`;
  }
  static getAllActiveDrivers() {
    return `SELECT * FROM ${active_driver_table}`;
  }
  static getAnActiveDrivers(driver_id: string) {
    return `SELECT * FROM ${active_driver_table} WHERE driver_id='${driver_id}'`;
  }
}
