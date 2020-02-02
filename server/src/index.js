"use strict";

const app = require("./app");

// starting the server

app.listen(app.get('port'), () => {
  console.log(`Server listening on port:${app.get('port')}`);
});
