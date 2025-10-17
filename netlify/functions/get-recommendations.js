import { Octokit } from "octokit";

export default async (event) => {
    // Handle CORS preflight requests
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

    // Only allow GET method
    console.log('Received request method1:', event.httpMethod);
    if (event.httpMethod !== 'GET') {
        console.log('Received request method2:', event.httpMethod);
        return new Response(JSON.stringify({ error: 'Método no permitido. Use GET.' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    // Main logic for GET request
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

        // Decode base64 content
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        const recommendations = JSON.parse(content);

        // Return the recommendations
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
        console.error('Error reading recommendations:', error);
        return new Response(JSON.stringify({
            error: 'Error leyendo recomendaciones: ' + error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};