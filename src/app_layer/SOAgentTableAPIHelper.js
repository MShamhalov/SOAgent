
function sanitizeTableAPIQuery(object) {
  const result = {};

  for (const [key, val] of Object.entries(object)) {
    if (val !== null && typeof val === 'object' && 'value' in val) {
      result[key] = val.value;
    } else if (val === true) {
      result[key] = 1;
    } else if (val === false) {
      result[key] = 0;
    } else {
      result[key] = val;
    }
  }

  return result;
}

module.exports = { sanitizeTableAPIQuery };
