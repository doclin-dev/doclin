import { Request, Response } from "express";
import { Thread } from "../database/entities/Thread";
import { ThreadRepository } from "../database/repositories/ThreadRepository";
import OpenAI from "openai";
import { getThreadText } from "./utils/snippetUtils";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const postPrompt = async (req: Request, res: Response) => {
	const prompt: string = req.body.prompt;
	const projectId: any = req.params.projectId;

	const threads: Thread[] = await ThreadRepository.searchThreads(prompt, projectId);

	const threadTexts: string[] = threads.map((thread, threadIndex) => {
		const replyTexts = thread.replies.map((reply, replyIndex) => `Reply ${replyIndex+1}: ${getThreadText(reply)}`).join('\n');
		return `Thread ${threadIndex+1}: ${thread.title ?? ''} \n ${getThreadText(thread)} \n ${replyTexts}`;
	});

	let systemPrompt: string = `References: \n\n ${threadTexts.join('\n\n')} \n\n`;
	systemPrompt += `---------\n\n`;
	systemPrompt += `Answer user's prompt using the references above formatted in HTML`;


	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [
			{
				"role": "system",
				"content": systemPrompt
			},
			{
				"role": "user",
				"content": prompt
			}
		],
		temperature: 1,
		max_tokens: 256,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	});

	const reply = response.choices[0].message.content;

	console.log(systemPrompt);
	console.log(reply);

	res.send({ reply: reply });
};