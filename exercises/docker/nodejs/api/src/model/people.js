require("../infra/dbConn");

module.exports = class People {
  constructor(name) {
    this.name = name;
  }

  save(repository) {
    if (this.name != undefined) {
      repository.save(name);
    }
  }
};
