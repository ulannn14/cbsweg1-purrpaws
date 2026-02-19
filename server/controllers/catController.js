const db = require("../config/db");

exports.getAllCats = (req, res) => {
  db.query("SELECT * FROM cats", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
};
