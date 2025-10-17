export default async (event) => {
    console.log('Simple test function called');
    
    return new Response(JSON.stringify({
        success: true,
        message: 'Simple test working!',
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
};