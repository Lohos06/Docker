document.getElementById("formulaire").addEventListener("submit", async (e) => {
  e.preventDefault();
  const donnees = Object.fromEntries(new FormData(e.target));
  const reponse = await fetch("/api/armes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donnees),
  });
  const message = document.getElementById("message");
  if (reponse.ok) {
    message.textContent = "";
    e.target.reset();
  } else {
    const erreur = await reponse.json();
    message.textContent = "Impossible d'enregistrer : " + erreur.erreur;
  }
});