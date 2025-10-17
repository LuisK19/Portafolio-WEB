import { Octokit } from "octokit";

export default async (event) => {
  // Manejar CORS
  if (event.httpMethod === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  // Solo permitir GET
  if (event.httpMethod !== 'GET') {
    return new Response(JSON.stringify({ error: 'Método no permitido. Use GET.' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    const owner = "LuisK19";
    const repo = "Portafolio-WEB";
    const path = "public/Data/recommendations.json";

    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    // Decodificar base64
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    const recommendations = JSON.parse(content);

    return new Response(JSON.stringify({
      success: true,
      count: recommendations.length,
      recommendations: recommendations
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Error leyendo recomendaciones:', error);
    return new Response(JSON.stringify({
      error: 'Error leyendo recomendaciones: ' + error.message,
      suggestions: 'Verifica que el archivo recommendations.json existe en tu repositorio'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};