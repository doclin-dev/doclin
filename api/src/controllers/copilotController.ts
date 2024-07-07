import { Request, Response } from 'express';
import { Thread } from '../database/entities/Thread';
import { ThreadRepository } from '../database/repositories/ThreadRepository';
import OpenAI from 'openai';
import { getThreadText } from './utils/snippetUtils';
import { OPENAI_API_KEY } from '../envConstants';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const postPrompt = async (req: Request, res: Response) => {
  const userPrompt: string = req.body.prompt;
  const projectId: number = parseInt(req.params.projectId);

  const systemPrompt = await generateSystemPrompt(userPrompt, projectId);
  const reply = await sendPromptToOpenAI(systemPrompt, userPrompt);

  console.log(systemPrompt);
  console.log(reply);

  res.send({ reply: reply });
};

const generateSystemPrompt = async (userPrompt: string, projectId: number) => {
  const threads: Thread[] = await ThreadRepository.searchThreads(userPrompt, projectId);

  const threadTexts: string[] = threads.map((thread, threadIndex) => {
    const replyTexts = thread.replies
      .map((reply, replyIndex) => `Reply ${replyIndex + 1}: ${getThreadText(reply)}`)
      .join('\n');
    return `Thread ${threadIndex + 1}: ${thread.title ?? ''} \n ${getThreadText(thread)} \n ${replyTexts}`;
  });

  let systemPrompt: string = `References: \n\n ${threadTexts.join('\n\n')} \n\n`;
  systemPrompt += `---------\n\n`;
  systemPrompt += `Answer user's prompt using the references above. Format your response in HTML`;

  return systemPrompt;
};

const sendPromptToOpenAI = async (systemPrompt: string, userPrompt: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.choices[0].message.content;
};
