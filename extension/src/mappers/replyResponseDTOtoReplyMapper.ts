import { utc } from 'moment';
import { ReplyResponseDTO } from '$shared/types/ReplyResponseDTO';
import { Reply, Snippet } from '../types';
import { mapSnippetResponseDTOToSnippet } from './snippetResponseDTOToSnippetMapper';
import { getDisplayMessage } from './threadDisplayMessageMapper';

export const mapReplyResponseDTOToReply = async (replyDTO: ReplyResponseDTO): Promise<Reply> => {
  const snippetsPromise: Promise<Snippet>[] = replyDTO.snippets.map((snippetResponseDTOs) =>
    mapSnippetResponseDTOToSnippet(snippetResponseDTOs)
  );
  const snippets: Snippet[] = await Promise.all(snippetsPromise);

  return {
    ...replyDTO,
    snippets: snippets,
    displayMessage: getDisplayMessage(replyDTO.message, snippets),
    hoverMessage: removeHtmlAndSnippetTags(replyDTO.message),
    displayCreationTime: utc(replyDTO?.createdAt).fromNow(),
  };
};

const removeHtmlAndSnippetTags = (threadMessage: string) => {
  let result = threadMessage.replace(/<[^>]*>/g, '');
  result = result.replace(/\[snippet_\d+\]/g, '');
  return result;
};
