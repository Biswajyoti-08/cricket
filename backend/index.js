const express = require("express");
const cors = require("cors");
const playerRoutes = require("./routes/players"); 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/players", playerRoutes);

app.get("/api/test", (req, res) => {
  res.send("✅ Backend is working!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});



