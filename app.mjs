import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import usersRoutes from "./routes/users.mjs";
import webRoutes from "./routes/web.mjs";

const app = express();
app.use(express.json());

app.use("", usersRoutes); // path is specifed in the original usersRoutes, if we add path here we will get an error
app.use("/", webRoutes);

const logHttp = fs.createWriteStream(path.join("logs", "http.log"), {
  flags: "a", // flags a - open the file for appending , flags w - open the file for writing
});

const logErrors = fs.createWriteStream(path.join("logs", "errors.log"), {
  flags: "a",
});

// morgan dosent have timestamp method so we need to create this one
morgan.token("timestamp", () => {
  return Date.now();
});
// same for error
morgan.token("error", () => {
  return new Error("Invalid path");
});

const logMsg = ":method :url :timestamp\n";
const errMsg = ":method :url :timestamp :error\n";

app.use(morgan(logMsg, { stream: logHttp }));
app.use(
  morgan(errMsg, {
    stream: logErrors,
    skip: (req, res) => res.statusCode < 400, // skip - skips all the code in the condition we put in (suppose to 'skip' all the status code below 400 in this case)
  })
);

const PORT = process.env.PORT || 3030;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`🌎  listening on`, `http://${HOST}:${PORT}`);
});
