import express from "express";
const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("Servidor funcionando - test 1");
});

app.listen(PORT, () => {
  console.log("Server running");
});