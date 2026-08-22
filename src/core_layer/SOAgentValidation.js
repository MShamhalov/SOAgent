class Validator {
  constructor() {}

  checkTableAttributes(object) {
    if (!object || typeof object !== 'object') return false;
    return Boolean(object.name && typeof object.name === 'string' && object.name.trim());
  }

  checkColumnAttributes(object) {
    if (!object || typeof object !== 'object') return false;
    return Boolean(
      object.column_name && typeof object.column_name === 'string' && object.column_name.trim() &&
      object.table_id
    );
  }
}

module.exports = { Validator };