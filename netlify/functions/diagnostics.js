export default async (event) => {
  // Verificar que event.path existe antes de usarlo
  const path = event.path || '';
  
  // Extraer solo la parte después de /functions/diagnostics
  const functionPath = path.replace('/.netlify/functions/diagnostics', '') || '/';

  if (functionPath === "/health" || functionPath === "/") {
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
          path: "/.netlify/functions/get-recommendations", 
          methods: ["GET", "OPTIONS"], 
          descripcion: "Obtiene las recomendaciones existentes." 
        },
        { 
          path: "/.netlify/functions/update-recommendations", 
          methods: ["POST", "OPTIONS"], 
          descripcion: "Agrega nuevas recomendaciones al archivo JSON en GitHub." 
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
    receivedPath: path,
    availablePaths: ['/health', '/metodos']
  }), {
    status: 404,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};