const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Le serveur Echo fonctionne !");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { name, history, question } = req.body;

    if (!history || !question) {
      return res.status(400).json({
        error: "Ajoute une conversation et une question."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.5",
      instructions: `Tu es Echo. Analyse la conversation fournie
pour comprendre le style de communication, le ton et les sujets
de la personne appelée ${name || "l'ami"}.
Propose une réponse plausible, basée uniquement sur les éléments
disponibles. Tu ne peux pas savoir avec certitude ce que cette
personne pense réellement. Ne prétends jamais être cette personne.`,
      input: `CONVERSATION :
${history}

QUESTION :
${question}

Propose une réponse claire et naturelle en français.`
    });

    res.json({ answer: response.output_text });
  } catch (error) {
    console.error("Erreur Echo :", error.message);
    res.status(500).json({
      error: "Impossible de générer une réponse. Vérifie la configuration du serveur."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur Echo démarré sur le port ${PORT}`);
});
