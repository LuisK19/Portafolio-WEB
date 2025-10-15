import { neon } from '@netlify/neon';

export default async (event) => {
  // Manejar preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  const sql = neon();

  if (event.httpMethod === 'GET') {
    const result = await sql`SELECT * FROM recommendations ORDER BY id DESC`;
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  if (event.httpMethod === 'POST') {
    const { name, position, text } = JSON.parse(event.body);
    if (!name || !position || !text) {
      return new Response(JSON.stringify({ error: 'Faltan campos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    await sql`
      INSERT INTO recommendations (name, position, text)
      VALUES (${name}, ${position}, ${text})
    `;
    return new Response(JSON.stringify({ message: 'Recomendación guardada' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  return new Response(JSON.stringify({ error: 'Método no permitido' }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};