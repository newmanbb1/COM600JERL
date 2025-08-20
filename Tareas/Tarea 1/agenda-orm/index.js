require("reflect-metadata");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AppDataSource = require("./data-source");
const Agenda = require("./Agenda");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

AppDataSource.initialize()
  .then(async () => {
    const repo = AppDataSource.getRepository("Agenda");

    app.post("/agenda", async (req, res) => {
      const agenda = repo.create(req.body);
      const result = await repo.save(agenda);
      res.json(result);
    });

    app.get("/agenda", async (req, res) => {
      const all = await repo.find();
      res.json(all);
    });

    app.put("/agenda/:id", async (req, res) => {
      const { id } = req.params;
      await repo.update(id, req.body);
      const updated = await repo.findOneBy({ id: parseInt(id) });
      res.json(updated);
    });

    app.delete("/agenda/:id", async (req, res) => {
      await repo.delete(req.params.id);
      res.json({ message: "Eliminado correctamente" });
    });

    app.listen(4000, () =>
      console.log("Servidor TypeORM corriendo en http://localhost:4000")
    );
  })
  .catch((error) => console.log("Error: ", error));
