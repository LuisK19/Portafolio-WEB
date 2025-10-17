import { Octokit } from "octokit";

export default async (event) => {
    // DIAGNÓSTICO COMPLETO
    console.log('=== GET-RECOMMENDATIONS DIAGNOSTIC ===');
    console.log('Event object:', JSON.stringify(event, null, 2));
    console.log('HTTP Method from event:', event.httpMethod);
    console.log('Path:', event.path);
    
    // FALLBACK: Si httpMethod es undefined, asumimos que es GET
    const httpMethod = event.httpMethod || 'GET';
    console.log('Using HTTP method:', httpMethod);
    
    // Handle CORS
    if (httpMethod === 'OPTIONS') {
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
    if (httpMethod !== 'GET') {
        console.log('Method not allowed:', httpMethod);
        return new Response(JSON.stringify({ 
            error: 'Método no permitido. Use GET.',
            receivedMethod: httpMethod
        }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    // Lógica principal para GET
    try {
        console.log('Starting GitHub API call...');
        
        // Verificar que el token existe
        if (!process.env.GITHUB_TOKEN) {
            throw new Error('GITHUB_TOKEN no está configurado en Netlify');
        }

        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        const owner = "LuisK19";
        const repo = "Portafolio-WEB";
        const path = "public/Data/recommendations.json";

        console.log('Fetching file from GitHub...');
        const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path,
        });

        // Decodificar base64
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        const recommendations = JSON.parse(content);

        console.log('Successfully retrieved recommendations:', recommendations.length);

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
            error: 'Error leyendo recomendaciones: ' + error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};