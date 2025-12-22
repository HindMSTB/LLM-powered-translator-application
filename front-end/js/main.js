document.getElementById("translateBtn").addEventListener("click", async () => {
    const btn = document.getElementById("translateBtn");
    const text = document.getElementById("englishText").value.trim();

    if (!text) {
        alert("Please enter some text.");
        return;
    }

    btn.disabled = true;
    document.getElementById("darijaText").innerText = "Traduction en cours...";
const credentials = btoa("hind:0000");


    try {
        const response = await fetch("http://localhost:8080/api/translator/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + credentials
            },
            body: JSON.stringify({ text })
        });

        const rawText = await response.text();

        if (!response.ok) {
            document.getElementById("darijaText").innerText =
                "Erreur : " + rawText;
            return;
        }

        const data = JSON.parse(rawText);
        document.getElementById("darijaText").innerText =
            data.translation || "Pas de traduction reçue";

    } catch (err) {
        document.getElementById("darijaText").innerText =
            "Erreur de connexion : " + err.message;
    } finally {
        btn.disabled = false;
    }
});
