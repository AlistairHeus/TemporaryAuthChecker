const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const users = [
  {
    username: "jane_smith",
    apiSecret: "AbCdEfGhIjKlMnOpQrStUvWxYz123456",
    apiToken: "4yR8sdf7ffz8g1",
    allowedOrigins: ["https://mj6mw3.csb.app"],
  },
];
// Middleware to check if the request has a valid token
function authenticateToken(req, res, next) {
  // In a real API, you would check for a valid token here.
  // For our fake API, we will skip this step and allow all requests.
  next();
}

// Fake login endpoint
app.post("/login", (req, res) => {
  const { API_SECRET, API_TOKEN } = req.body;

  users.map((user) => {
    if (user.apiSecret == API_SECRET && user.apiToken == API_TOKEN) {
      res.json({
        isLoggedIn: true,
      });
    } else
      res.json({
        isLoggedIn: false,
      });
  });
});
// Fake protected endpoint
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected endpoint!" });
});

app.get(
  "/protected/:username/allowed-origins",
  authenticateToken,
  (req, res) => {
    const username = req.params.username;
    const user = users.find((u) => u.username === username);

    if (user) {
      res.json({ allowedOrigins: user.allowedOrigins });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }
);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
