export default async (event) => {
    return new Response(JSON.stringify({ 
        message: 'Función funcionando!',
        method: event.httpMethod,
        path: event.path 
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
};