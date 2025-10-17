import { Octokit } from "octokit";

export default async (event) => {
    // Manejar CORS
    if (event.httpMethod === 'OPTIONS') {
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
    if (event.httpMethod !== 'POST') {
        return new Response(JSON.stringify({ error: 'Método no permitido' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    try {
        const { name, position, text } = JSON.parse(event.body);

        if (!name || !position || !text) {
            return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Inicializar Octokit con el token
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        const owner = "LuisK19";
        const repo = "Portafolio-WEB";
        const path = "public/Data/recommendations.json";

        let currentContent;
        let fileSha;

        try {
            const { data } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path,
            });
            // Decodificar base64
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            currentContent = JSON.parse(content);
            fileSha = data.sha;
        } catch (error) {
            console.log('Error obteniendo archivo:', error.message);
            // Si el archivo no existe, empezar con array vacío
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

        const { data } = await octokit.rest.repos.createOrUpdateFileContents(updateParams);

        return new Response(JSON.stringify({
            success: true,
            message: 'Recomendación agregada exitosamente',
            commit: data.commit.html_url
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