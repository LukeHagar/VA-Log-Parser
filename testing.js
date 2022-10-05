import fs from "fs";

fs.readFile("./logs/ccg_spva2_08092022.log", (err, data) => {
  if (err) throw err;
  console.log(data);
});
