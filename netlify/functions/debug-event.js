export default async (event) => {
    console.log('=== DEBUG EVENT ===');
    console.log('Event keys:', Object.keys(event));
    console.log('Full event:', JSON.stringify(event));
    console.log('HTTP Method:', event.httpMethod);
    console.log('Path:', event.path);
    console.log('Raw URL:', event.rawUrl);
    console.log('Headers:', event.headers);
    console.log('=== END DEBUG ===');

    return new Response(JSON.stringify({
        success: true,
        eventKeys: Object.keys(event),
        httpMethod: event.httpMethod,
        path: event.path,
        rawUrl: event.rawUrl,
        headers: event.headers,
        message: 'Revisa los logs de Netlify para ver el evento completo'
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
};