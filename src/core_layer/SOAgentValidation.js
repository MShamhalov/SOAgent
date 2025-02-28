class Validator {
  constructor() {}

  checkTableAttributes(object) {
    let result = false;
    if (
      object.hasOwnProperty('name') && 
      object.name &&
      object.name 
    ) {
      result = true;
    }

    return result;
  }
}

module.exports = { Validator };