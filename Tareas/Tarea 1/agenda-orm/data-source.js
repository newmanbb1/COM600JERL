const { DataSource } = require("typeorm");
const Agenda = require("./Agenda");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",           // XAMPP default
  database: "agenda_db_orm",
  synchronize: true,      // crea tablas automáticamente
  logging: false,
  entities: [Agenda],
});

module.exports = AppDataSource;
