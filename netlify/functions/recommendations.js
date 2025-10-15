import { neon } from '@netlify/neon';

export default async (req, res) => {
  const sql = neon(); // Usa NETLIFY_DATABASE_URL automáticamente

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM recommendations ORDER BY id DESC`;
    return res.status(200).json(result);
  }

  if (req.method === 'POST') {
    const { name, position, text } = req.body;
    if (!name || !position || !text) {
      return res.status(400).json({ error: 'Faltan campos' });
    }
    await sql`
      INSERT INTO recommendations (name, position, text)
      VALUES (${name}, ${position}, ${text})
    `;
    return res.status(201).json({ message: 'Recomendación guardada' });
  }

  return res.status(405).json({ error: 'Método no permitido' });
};