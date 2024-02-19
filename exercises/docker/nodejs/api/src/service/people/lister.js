const People = require("../../model/people");

module.exports = class Lister {
  constructor(repository) {
    this.repository = repository
  }

  call() {
    return this.repository.list();
  }
};
