const RawStr = "task/160000000000000001";
const params = RawStr.split("/");

/** Business Rule Run Emulation **/
const current = new SimpleRecord(params[0]);
current.get(params[1]);

const previous = {};

/** Event Script Run Emulation **/
const event = {
  instance: "",
  param_1: "",
  param_2: "",
  param_3: "",
  param_4: "",
  param_5: "",
};
