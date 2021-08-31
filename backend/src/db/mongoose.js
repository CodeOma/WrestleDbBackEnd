const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_OFFLINE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
