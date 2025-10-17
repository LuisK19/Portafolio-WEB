export default async (event) => {
  if (event.path === "/.netlify/functions/health") {
    return new Response(JSON.stringify({
      status: "ok",
      time: new Date().toISOString(),
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (event.path === "/.netlify/functions/metodos") {
    return new Response(JSON.stringify({
      descripcion: "Lista de endpoints y métodos disponibles en las serverless functions.",
      metodos: [
        { path: "/.netlify/functions/update-recommendations", methods: ["POST", "OPTIONS"], descripcion: "Agrega recomendaciones al archivo JSON en GitHub." },
        { path: "/.netlify/functions/health", methods: ["GET"], descripcion: "Diagnóstico rápido del estado de la API." },
        { path: "/.netlify/functions/metodos", methods: ["GET"], descripcion: "Lista los endpoints y métodos disponibles." }
      ]
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  return new Response(JSON.stringify({ error: 'Ruta no encontrada' }), {
    status: 404,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};