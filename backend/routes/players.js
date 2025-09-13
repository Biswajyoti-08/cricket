const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {
  db.query("SELECT * FROM players", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/with-stats", (req, res) => {
  const query = `
    SELECT p.player_id, p.name, p.role, p.is_playing, p.is_substitute,
           s.matches, s.runs, s.wickets, s.catches
    FROM players p
    LEFT JOIN stats s ON p.player_id = s.player_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM players WHERE player_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ message: "Player not found" });
    res.json(results[0]);
  });
});

router.get("/:id/stats", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.player_id, p.name, p.role, p.is_playing, p.is_substitute,
           s.matches, s.runs, s.wickets, s.catches
    FROM players p
    LEFT JOIN stats s ON p.player_id = s.player_id
    WHERE p.player_id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ message: "Player not found" });
    res.json(results[0]);
  });
});

router.post("/", (req, res) => {
  const { name, role, is_playing, is_substitute, matches, runs, wickets, catches } = req.body;

  db.query(
    "INSERT INTO players (name, role, is_playing, is_substitute) VALUES (?, ?, ?, ?)",
    [name, role, is_playing, is_substitute],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const playerId = results.insertId;
      db.query(
        "INSERT INTO stats (player_id, matches, runs, wickets, catches) VALUES (?, ?, ?, ?, ?)",
        [playerId, matches || 0, runs || 0, wickets || 0, catches || 0],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "Player with stats added", player_id: playerId });
        }
      );
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, role, is_playing, is_substitute, matches, runs, wickets, catches } = req.body;

  db.query(
    "UPDATE players SET name = ?, role = ?, is_playing = ?, is_substitute = ? WHERE player_id = ?",
    [name, role, is_playing, is_substitute, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(
        "UPDATE stats SET matches = ?, runs = ?, wickets = ?, catches = ? WHERE player_id = ?",
        [matches, runs, wickets, catches, id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "Player and stats updated" });
        }
      );
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM players WHERE player_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Player deleted" });
  });
});

module.exports = router;
