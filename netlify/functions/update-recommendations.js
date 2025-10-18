import { Octokit } from "octokit";

export default async (event) => {
    // DIAGNÓSTICO COMPLETO
    console.log('=== UPDATE-RECOMMENDATIONS DIAGNOSTIC ===');
    console.log('Event object keys:', Object.keys(event));
    console.log('HTTP Method from event:', event.httpMethod);
    console.log('Path:', event.path);
    console.log('Body type:', typeof event.body);
    console.log('Body content:', event.body);
    
    // FALLBACK: Si httpMethod es undefined, asumimos POST si hay body
    const httpMethod = event.httpMethod || 'POST';
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
        console.log('Processing POST request...');
        
        // Verificar que el body existe y es string
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

        // Parsear el body de forma segura
        let parsedBody;
        try {
            // Si event.body ya es un objeto, usarlo directamente
            if (typeof event.body === 'object' && !Array.isArray(event.body)) {
                parsedBody = event.body;
            } else {
                // Si es string, parsearlo como JSON
                parsedBody = JSON.parse(event.body);
            }
        } catch (parseError) {
            console.error('Error parsing body:', parseError);
            return new Response(JSON.stringify({
                error: 'Formato de datos inválido. Se esperaba JSON.',
                bodyReceived: event.body
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const { name, position, text } = parsedBody;
        console.log('Parsed data:', { 
            name, 
            position, 
            textLength: text ? text.length : 0 
        });

        if (!name || !position || !text) {
            return new Response(JSON.stringify({ 
                error: 'Faltan campos requeridos',
                received: { name: !!name, position: !!position, text: !!text }
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
            console.error('GITHUB_TOKEN no configurado');
            return new Response(JSON.stringify({
                error: 'Error de configuración del servidor'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
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
            console.log('Fetching current file from GitHub...');
            const { data } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path,
            });
            
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            currentContent = JSON.parse(content);
            fileSha = data.sha;
            console.log('Current recommendations:', currentContent.length);
        } catch (error) {
            console.log('Creating new file:', error.message);
            currentContent = [];
        }

        // Agregar la nueva recomendación
        const newRecommendation = {
            name: name.trim(),
            position: position.trim(),
            text: text.trim(),
            date: new Date().toISOString().split('T')[0]
        };

        currentContent.push(newRecommendation);

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

        if (fileSha) {
            updateParams.sha = fileSha;
        }

        console.log('Updating GitHub file...');
        const { data } = await octokit.rest.repos.createOrUpdateFileContents(updateParams);

        console.log('Success! File updated on GitHub');
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
        console.error('Error in update-recommendations:', error);
        return new Response(JSON.stringify({
            error: 'Error interno del servidor: ' + error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};