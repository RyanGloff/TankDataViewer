import express from "express";

const PORT = process.env.WEB_UI_PORT || 8081;

const app = express();

app.use("/ui", express.static("public"));
app.get("/ui/hello", (req, res) => {
  return res.send("world");
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
