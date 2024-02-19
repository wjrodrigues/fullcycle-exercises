const People = require("../../model/people");

module.exports = class Creator {
  constructor(repository) {
    this.repository = repository
  }

  call(name) {
    const people = new People(name);

    this.repository.save(people.name);
  }
};
