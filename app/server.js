const os = require("node:os");
const path = require("node:path");
const express = require("express");
const { Pool } = require("pg");

const PORT = process.env.PORT || 3000;
const pool = new Pool();
let baseConnectee = false;

async function connecterLaBase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS armes (
      id serial PRIMARY KEY,
      nom text NOT NULL,
      type text NOT NULL,
      composant text NOT NULL,
    )
  `);
  baseConnectee = true;
}

const app = express();
app.use(express.json());

// affihcer la page index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// recuperer la liste des armes.
app.get("/api/armes", async (req, res) => {
  if (!baseConnectee) {
    return res.status(503).json({ erreur: "base non connectée" });
  }
  const { rows } = await pool.query(
    "SELECT id, salle, to_char(jour, 'YYYY-MM-DD') AS jour, creneau, motif FROM reservations ORDER BY jour, creneau, id"
  );
  res.json(rows);
});

// forger une arme
app.post("/api/armes", async (req, res) => {
  if (!baseConnectee) {
    return res.status(503).json({ erreur: "base non connectée" });
  }

  const { nom, type, composant } = req.body || {};
  if (!nom || !type || !composant) {
    return res.status(400).json({ erreur: "nom, type, composant sont obligatoires" });
  }

  const { rows } = await pool.query(
    "INSERT INTO reservations (nom, type, composant) VALUES ($1, $2, $3) RETURNING id, nom, type, composant",
    [nom, type, composant]
  );
  res.status(201).json(rows[0]);

});

// demarrer le serveur et se connecter à la base de données.
app.listen(PORT, () => {
  connecterLaBase();
});
// Arrêt du serveur
process.on("SIGTERM", () => {
  process.exit(0);
});
