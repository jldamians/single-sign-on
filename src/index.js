"use strict";

const app = require("./app");

app.listen(app.get('port'), () => {
  console.log(`Server listening on http://localhost:${app.get('port')}`);
});
