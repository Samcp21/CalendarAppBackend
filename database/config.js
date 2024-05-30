const mmongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mmongoose.connect(process.env.DB_CNN);
    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de iniciar la BD");
  }
};

module.exports = {
  dbConnection,
};
