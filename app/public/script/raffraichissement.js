async function rafraichir() {
  const liste = document.getElementById("liste");
  const reponse = await fetch("/api/armes");
  if (!reponse.ok) {
    liste.innerHTML = '<tr><td colspan="3">Pas de base de données : rien à afficher pour l\'instant.</td></tr>';
    return;
  }
  const armes = await reponse.json();
  liste.innerHTML = armes
    .map((a) => `<tr><td>${a.nom}</td><td>${a.type}</td><td>${a.composant}</td></tr>`)
    .join("");
}

rafraichir();
setInterval(rafraichir, 1000);