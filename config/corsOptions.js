const cors = require("cors");

const corsOptions = {
  origin: "https://recipebookmark.netlify.app/",
  optionSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(corsOptions);
