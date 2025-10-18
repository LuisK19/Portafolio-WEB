import { Octokit } from "octokit";

export default async (event) => {
    // DIAGNÓSTICO COMPLETO
    console.log('=== UPDATE-RECOMMENDATIONS DIAGNOSTIC ===');
    console.log('Event object:', JSON.stringify(event, null, 2));
    console.log('HTTP Method from event:', event.httpMethod);
    console.log('Path:', event.path);
    console.log('Body received:', event.body ? 'Yes' : 'No');
    
    // FALLBACK: Si httpMethod es undefined, inferimos basado en el contexto
    // Para update, si hay body, asumimos que es POST
    const httpMethod = event.httpMethod || (event.body ? 'POST' : 'GET');
    console.log('Using HTTP method:', httpMethod);
    
    // Handle CORS
    if (httpMethod === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    // Solo permitir POST
    if (httpMethod !== 'POST') {
        console.log('Method not allowed for update:', httpMethod);
        return new Response(JSON.stringify({ 
            error: 'Método no permitido. Use POST.',
            receivedMethod: httpMethod
        }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    // Lógica principal para POST
    try {
        console.log('Processing POST request - Adding recommendation...');
        
        // Verificar que el body existe
        if (!event.body) {
            return new Response(JSON.stringify({ 
                error: 'No se recibieron datos en el cuerpo de la solicitud' 
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const { name, position, text } = JSON.parse(event.body);
        console.log('Parsed data:', { name, position, text: text?.substring(0, 50) + '...' });

        if (!name || !position || !text) {
            return new Response(JSON.stringify({ 
                error: 'Faltan campos requeridos: name, position, text' 
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

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

        let currentContent;
        let fileSha;

        try {
            console.log('Fetching current recommendations from GitHub...');
            const { data } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path,
            });
            
            // Decodificar base64
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            currentContent = JSON.parse(content);
            fileSha = data.sha;
            console.log('Current recommendations count:', currentContent.length);
        } catch (error) {
            console.log('Archivo no existe, creando nuevo:', error.message);
            currentContent = [];
        }

        // Agregar la nueva recomendación
        const newRecommendation = {
            name,
            position,
            text,
            date: new Date().toISOString().split('T')[0]
        };

        currentContent.push(newRecommendation);
        console.log('New recommendations count:', currentContent.length);

        // Codificar a base64
        const contentBase64 = Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64');

        // Preparar parámetros para actualizar
        const updateParams = {
            owner,
            repo,
            path,
            message: `Agregar recomendación de ${name}`,
            content: contentBase64
        };

        // Solo agregar SHA si el archivo ya existe
        if (fileSha) {
            updateParams.sha = fileSha;
        }

        console.log('Updating file on GitHub...');
        const { data } = await octokit.rest.repos.createOrUpdateFileContents(updateParams);

        console.log('Successfully updated GitHub file');
        return new Response(JSON.stringify({
            success: true,
            message: 'Recomendación agregada exitosamente',
            commit: data.commit.html_url,
            newCount: currentContent.length
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Error en update-recommendations:', error);
        return new Response(JSON.stringify({
            error: 'Error interno del servidor: ' + error.message,
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