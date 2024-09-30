import { ThreadResponseDTO } from '$shared/types/ThreadResponseDTO';
import { Snippet, Thread } from '../types';
import { mapSnippetResponseDTOToSnippet } from './snippetResponseDTOToSnippetMapper';
import { getDisplayMessage } from './threadDisplayMessageMapper';
import { utc } from 'moment';

export const mapThreadResponseDTOToThread = async (threadDTO: ThreadResponseDTO): Promise<Thread> => {
  const snippetsPromise: Promise<Snippet>[] = threadDTO.snippets.map((snippetResponseDTOs) =>
    mapSnippetResponseDTOToSnippet(snippetResponseDTOs)
  );
  const snippets: Snippet[] = await Promise.all(snippetsPromise);

  return {
    ...threadDTO,
    snippets: snippets,
    displayMessage: getDisplayMessage(threadDTO.message, snippets),
    hoverMessage: removeHtmlAndSnippetTags(threadDTO.message),
    displayCreationTime: utc(threadDTO?.createdAt).fromNow(),
  };
};

const removeHtmlAndSnippetTags = (threadMessage: string) => {
  let result = threadMessage.replace(/<[^>]*>/g, '');
  result = result.replace(/\[snippet_\d+\]/g, '');
  return result;
};
