const express = require("express");
const { faker } = require("@faker-js/faker");
const PeopleCreator = require("./src/service/people/creator");
const PeopleLister = require("./src/service/people/lister");
const RepositoryPeople = require("./src/repository/people");
const DB = require("./src/infra/dbConn");

const app = express();
const port = 3000;
const db = new DB();

app.get("/", async (req, res) => {
  const name = faker.person.fullName();
  const repository = new RepositoryPeople(db);

  new PeopleCreator(repository).call(name);

  const peoples = await new PeopleLister(repository).call();
  const values = peoples.map((p) => `<li>ID: ${p.id} - Name: ${p.name}</li>`).join("")

  res.send(`
    <h1>Full Cycle Rocks!</h1>
    </br>
    <h2>Nome salvo: ${name}</h2>
    <h2>Nomes salvos</h2>
    <ul>
      ${values}
    </ul>
    `);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
