export default async (event) => {
  if (event.path === "/.netlify/functions/health") {
    return new Response(JSON.stringify({
      status: "ok",
      time: new Date().toISOString(),
  node: 'unsupported',
  env: 'unsupported'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (event.path === "/.netlify/functions/metodos") {
    return new Response(JSON.stringify({
      descripcion: "Lista de endpoints y métodos disponibles en las serverless functions.",
      metodos: [
        { path: "/.netlify/functions/create-recommendations", methods: ["POST", "OPTIONS"], descripcion: "Recibe recomendaciones y las crea como issue en GitHub." },
        { path: "/.netlify/functions/health", methods: ["GET"], descripcion: "Diagnóstico rápido del estado de la API." },
        { path: "/.netlify/functions/metodos", methods: ["GET"], descripcion: "Lista los endpoints y métodos disponibles." }
      ]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ error: 'Ruta no encontrada' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
};
