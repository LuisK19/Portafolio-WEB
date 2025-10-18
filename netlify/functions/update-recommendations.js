import { Octokit } from "octokit";

export default async (event) => {
    // DIAGNÓSTICO COMPLETO DEL BODY
    console.log('=== UPDATE-RECOMMENDATIONS DIAGNOSTIC ===');
    console.log('Event object keys:', Object.keys(event));
    console.log('HTTP Method from event:', event.httpMethod);
    console.log('Body type:', typeof event.body);
    console.log('Body content:', event.body);
    console.log('Body is string?', typeof event.body === 'string');
    console.log('Body is object?', typeof event.body === 'object' && event.body !== null);
    
    // FALLBACK: Siempre asumir POST para esta función
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
        
        let parsedBody = {};
        
        // MÚLTIPLES INTENTOS DE PARSEAR EL BODY
        if (event.body) {
            try {
                // Intento 1: Si es string JSON
                if (typeof event.body === 'string') {
                    parsedBody = JSON.parse(event.body);
                } 
                // Intento 2: Si ya es objeto
                else if (typeof event.body === 'object' && event.body !== null) {
                    parsedBody = event.body;
                }
                // Intento 3: Si es un objeto con propiedad body
                else if (event.body.body && typeof event.body.body === 'string') {
                    parsedBody = JSON.parse(event.body.body);
                }
            } catch (parseError) {
                console.error('Error parsing body:', parseError);
                // Continuar con objeto vacío
            }
        }
        
        console.log('Parsed body result:', parsedBody);
        console.log('Parsed body keys:', Object.keys(parsedBody));

        // EXTRAER CAMPOS CON MÚLTIPLES ALTERNATIVAS
        const name = parsedBody.name || parsedBody.nombre || '';
        const position = parsedBody.position || parsedBody.puesto || parsedBody.role || '';
        const text = parsedBody.text || parsedBody.texto || parsedBody.recommendation || parsedBody.recomendacion || '';

        console.log('Extracted fields:', { 
            name: name ? `"${name}" (length: ${name.length})` : 'EMPTY',
            position: position ? `"${position}" (length: ${position.length})` : 'EMPTY', 
            text: text ? `"${text.substring(0, 50)}..." (length: ${text.length})` : 'EMPTY'
        });

        // Validación de campos
        if (!name || !position || !text) {
            return new Response(JSON.stringify({ 
                error: 'Faltan campos requeridos',
                details: {
                    name: name ? 'PRESENTE' : 'FALTANTE',
                    position: position ? 'PRESENTE' : 'FALTANTE',
                    text: text ? 'PRESENTE' : 'FALTANTE',
                    receivedBody: parsedBody,
                    rawBody: event.body
                }
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

        // PROSEGUIR CON GITHUB API
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
            
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            currentContent = JSON.parse(content);
            fileSha = data.sha;
            console.log('Current recommendations count:', currentContent.length);
        } catch (error) {
            console.log('Creating new recommendations file:', error.message);
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

        if (fileSha) {
            updateParams.sha = fileSha;
        }

        console.log('Updating file on GitHub...');
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