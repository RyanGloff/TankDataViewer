import express from "express";

const PORT = process.env.API_PORT || 8080;

const app = express();

app.get("/api/hello", (req, res) => {
  return res.send("world");
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
