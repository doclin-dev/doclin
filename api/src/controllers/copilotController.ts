import { Request, Response } from 'express';
import { Thread } from '../database/entities/Thread';
import { ThreadRepository } from '../database/repositories/ThreadRepository';
import OpenAI from 'openai';
import { getThreadMessageWithSnippet } from '../utils/snippetUtils';
import { OPENAI_API_KEY } from '../envConstants';
import { Reply } from 'src/database/entities/Reply';

const systemPrompt = `
    You are an AI assistant helping helping understanding code using documentation and discussion.
    Provide detailed and context-aware responses based on the input provided. Format your answer in HTML.
`;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const postPrompt = async (req: Request, res: Response) => {
  const userPrompt: string = req.body.prompt;
  const referToDoclinThreads: boolean = req.body.referToDoclinThreads;
  // const referToCodeFile: boolean = req.body.referToCodeFile;
  const projectId: number = parseInt(req.params.projectId);

  const completeUserPrompt = await generateUserPrompt(userPrompt, projectId, referToDoclinThreads);
  console.log(completeUserPrompt);
  const reply = await getResponseFromGPT(completeUserPrompt);
  res.send({ reply: reply });
};

const generateUserPrompt = async (
  userPrompt: string,
  projectId: number,
  referToDoclinThreads: boolean
): Promise<string> => {
  let completeUserPrompt = `${userPrompt}\n`;
  completeUserPrompt += `Answer the above question using the references below. Only use the reference if they are relevant to the question\n`;

  if (referToDoclinThreads) {
    completeUserPrompt += (await getThreadsReference(userPrompt, projectId)) ?? `No relevant discussion threads found.`;
    completeUserPrompt += `\n`;
  }

  return completeUserPrompt;
};

const getThreadsReference = async (userPrompt: string, projectId: number): Promise<string | null> => {
  const threads: Thread[] = await ThreadRepository.searchThreads(userPrompt, projectId, 5);

  if (threads.length === 0) {
    return null;
  }

  let response = `Discussion threads reference:\n`;
  response += threads.slice(0, 10).map(getThreadReference).join('\n');
  response += '\n';

  return response;
};

const getThreadReference = (thread: Thread, index: number, threads: Thread[]): string => {
  let response = `Thread ${index + 1} of ${threads.length}\n`;
  response += `${thread.title ?? ''}\n`;
  response += `${getThreadMessageWithSnippet(thread)}\n`;
  response += thread.replies.map(getReplyReference).join('\n');
  return response;
};

const getReplyReference = (reply: Reply, index: number, replies: Reply[]): string => {
  return `Reply ${index + 1} of ${replies.length}: ${getThreadMessageWithSnippet(reply)}`;
};

const getResponseFromGPT = async (userPrompt: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
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
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};
