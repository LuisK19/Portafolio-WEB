
import { Octokit } from "octokit";

export default async (event) => {
	if (event.httpMethod !== 'POST') {
		return new Response(JSON.stringify({ error: 'Método no permitido' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const { name, position, text } = JSON.parse(event.body);
		if (!name || !position || !text) {
			return new Response(JSON.stringify({ error: 'Faltan campos' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN });
		const owner = "LuisK19";
		const repo = "Portafolio-WEB";
		const title = `Recomendación de ${name}`;
		const body = `**Nombre:** ${name}\n**Puesto:** ${position}\n**Recomendación:**\n${text}`;

		const response = await octokit.request("POST /repos/{owner}/{repo}/issues", {
			owner,
			repo,
			title,
			body
		});

		return new Response(JSON.stringify({ url: response.data.html_url }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
