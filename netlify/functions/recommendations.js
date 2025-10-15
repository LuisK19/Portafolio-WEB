import { neon } from '@netlify/neon';

export default async (event) => {
  const sql = neon();

  if (event.httpMethod === 'GET') {
    const result = await sql`SELECT * FROM recommendations ORDER BY id DESC`;
    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  if (event.httpMethod === 'POST') {
    const { name, position, text } = JSON.parse(event.body);
    if (!name || !position || !text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    await sql`
      INSERT INTO recommendations (name, position, text)
      VALUES (${name}, ${position}, ${text})
    `;
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Recomendación guardada' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Método no permitido' }),
    headers: { 'Content-Type': 'application/json' }
  };
};