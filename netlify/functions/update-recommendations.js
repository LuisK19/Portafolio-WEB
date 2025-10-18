import { Octokit } from "octokit";

// Función auxiliar para leer el ReadableStream
async function readStream(stream) {
    const reader = stream.getReader();
    const chunks = [];
    
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }
    } finally {
        reader.releaseLock();
    }
    
    // Combinar los chunks en un string
    const buffer = Buffer.concat(chunks);
    return buffer.toString('utf8');
}

export default async (event) => {
    // DIAGNÓSTICO COMPLETO
    console.log('=== UPDATE-RECOMMENDATIONS DIAGNOSTIC ===');
    console.log('Event object keys:', Object.keys(event));
    console.log('HTTP Method from event:', event.httpMethod);
    console.log('Body type:', typeof event.body);
    console.log('Body content:', event.body);
    
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
        
        // MANEJO DE READABLE STREAM
        if (event.body && typeof event.body === 'object' && event.body.getReader) {
            console.log('Body is ReadableStream, reading...');
            try {
                const bodyText = await readStream(event.body);
                console.log('Body text extracted:', bodyText);
                
                if (bodyText) {
                    parsedBody = JSON.parse(bodyText);
                }
            } catch (streamError) {
                console.error('Error reading stream:', streamError);
                return new Response(JSON.stringify({
                    error: 'Error leyendo los datos de la solicitud'
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
        } else {
            // Manejo para otros tipos de body (por si acaso)
            console.log('Body is not a ReadableStream, using direct approach');
            if (event.body) {
                try {
                    if (typeof event.body === 'string') {
                        parsedBody = JSON.parse(event.body);
                    } else if (typeof event.body === 'object') {
                        parsedBody = event.body;
                    }
                } catch (parseError) {
                    console.error('Error parsing body:', parseError);
                }
            }
        }
        
        console.log('Parsed body result:', parsedBody);
        console.log('Parsed body keys:', Object.keys(parsedBody));

        // EXTRAER CAMPOS
        const name = parsedBody.name || '';
        const position = parsedBody.position || '';
        const text = parsedBody.text || '';

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
                    receivedBody: parsedBody
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