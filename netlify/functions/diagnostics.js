export default async (event) => {
    // Extraer solo la parte después de /functions/
    const functionPath = event.path.replace('/.netlify/functions/diagnostics', '');
    
    if (functionPath === "" || functionPath === "/health") {
        return new Response(JSON.stringify({
            status: "ok",
            time: new Date().toISOString(),
            node: "Netlify Functions",
            env: "production"
        }), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    if (functionPath === "/metodos") {
        return new Response(JSON.stringify({
            descripcion: "Lista de endpoints y métodos disponibles en las serverless functions.",
            metodos: [
                { 
                    path: "/.netlify/functions/update-recommendations", 
                    methods: ["POST", "OPTIONS", "GET"], 
                    descripcion: "Agrega y lee recomendaciones del archivo JSON en GitHub." 
                },
                { 
                    path: "/.netlify/functions/health", 
                    methods: ["GET"], 
                    descripcion: "Diagnóstico rápido del estado de la API." 
                },
                { 
                    path: "/.netlify/functions/metodos", 
                    methods: ["GET"], 
                    descripcion: "Lista los endpoints y métodos disponibles." 
                },
                { 
                    path: "/.netlify/functions/simple-test", 
                    methods: ["GET"], 
                    descripcion: "Prueba simple de funcionamiento." 
                },
                { 
                    path: "/.netlify/functions/test", 
                    methods: ["GET"], 
                    descripcion: "Prueba de funcionamiento." 
                }
            ]
        }), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    return new Response(JSON.stringify({ 
        error: 'Ruta no encontrada',
        path: event.path,
        functionPath: functionPath
    }), {
        status: 404,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
};