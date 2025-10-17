import { Octokit } from "octokit";

export default async (event) => {
    // Manejar CORS
    if (event.httpMethod === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

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

        // 1. Primero obtener el contenido actual del archivo
        const owner = "LuisK19";
        const repo = "Portafolio-WEB";
        const path = "public/Data/recommendations.json";

        let currentContent;
        try {
            const { data } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path,
            });
            currentContent = JSON.parse(Buffer.from(data.content, 'base64').toString());
        } catch (error) {
            console.log('Error: ' + error.message);
            // Si el archivo no existe, empezar con array vacío
            currentContent = [];
        }

        // 2. Agregar la nueva recomendación
        const newRecommendation = {
            name,
            position,
            text,
            date: new Date().toISOString().split('T')[0]
        };

        currentContent.push(newRecommendation);

        // 3. Actualizar el archivo en GitHub
        const { data } = await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: `Agregar recomendación de ${name}`,
            content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64'),
            // Si el archivo ya existe, necesitamos el SHA
            ...(await octokit.rest.repos.getContent({ owner, repo, path }).then(r => ({ sha: r.data.sha })).catch(() => ({})))
        });

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