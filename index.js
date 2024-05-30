const express = require("express");
const { dbConnection } = require("./database/config");
const app = express();
const cors = require("cors");
dbConnection();

app.use(cors());

const { PORT } = process.env;
app.use(express.static("public"));

app.use(express.json());

// auth//crear/login/reneew

app.use("/api/auth", require("./routes/auth"));
app.use("/api/event", require("./routes/events"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
