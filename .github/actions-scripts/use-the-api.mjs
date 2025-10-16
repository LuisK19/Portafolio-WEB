import { Octokit } from "octokit";

// Usa el token de entorno (por seguridad, nunca lo pongas en el código)
const octokit = new Octokit({ auth: process.env.TOKEN });

const owner = "LuisK19"; // tu usuario
const repo = "Portafolio-WEB"; // tu repo

// Ejemplo: crear un issue con una recomendación
const title = "Nueva recomendación";
const body = "Texto de la recomendación, nombre y puesto aquí.";

async function createRecommendationIssue() {
  const response = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner,
    repo,
    title,
    body
  });
  console.log("Issue creado:", response.data.html_url);
}

createRecommendationIssue();
