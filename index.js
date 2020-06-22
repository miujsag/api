require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { handleError, notFound } = require("./handlers/error");

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use("/", require("./router"));
app.get("*", notFound);
app.use(handleError);

app.listen(port, function () {
  console.log(`API is running on port ${port}`);
});
