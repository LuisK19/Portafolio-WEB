export default async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ 
      message: 'Función funcionando!',
      method: event.httpMethod,
      path: event.path 
    })
  };
};