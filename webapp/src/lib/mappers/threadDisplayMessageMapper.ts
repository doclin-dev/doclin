import type { SnippetResponseDTO } from '$shared/types/SnippetResponseDTO';
import { addLineNumbers, highlightCode } from './snippetFormatUtil';

const PRE_TAG_START: string = `<pre class="overflow-x-scroll border-0 text-sm" spellcheck="false" contenteditable="false" style="scrollbar-width: thin; scrollbar-color: gray rgb(17, 24, 39);">`;
const PRE_TAG_END: string = `</pre>`;

const GIT_ICON: string = `<span class="icon">
								<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="15" height="15" viewBox="0 0 24 24">
									<path fill="currentColor" d="M2.6 10.59L8.38 4.8l1.69 1.7c-.24.85.15 1.78.93 2.23v5.54c-.6.34-1 
									.99-1 1.73a2 2 0 0 0 2 2a2 2 0 0 0 2-2c0-.74-.4-1.39-1-1.73V9.41l2.07 2.09c-.07.15-.07.32-.07.5a2 
									2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2c-.18 0-.35 0-.5.07L13.93 7.5a1.98 1.98 0 0 0-1.15-2.34c-.43-.16-.88-.2-1.28-.09L9.8 
									3.38l.79-.78c.78-.79 2.04-.79 2.82 0l7.99 7.99c.79.78.79 2.04 0 2.82l-7.99 7.99c-.78.79-2.04.79-2.82 
									0L2.6 13.41c-.79-.78-.79-2.04 0-2.82Z">
									</path>
								</svg>
							</span>`;

const FILE_ICON: string = `<span class="icon">
								<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="15" height="15" viewBox="0 0 24 24">
									<path fill="currentColor" d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m9 16v-2H6v2h9m3-4v-2H6v2h12Z">
									</path>
								</svg>
							</span>`;

export const getDisplayMessage = (message: string, snippets: SnippetResponseDTO[]) => {
  let displayMessage = message;

  for (const snippet of snippets) {
    displayMessage = displayMessage.replace(
      getSnippetTag(snippet.id),
      getReadableCodeBlock(snippet.filePath, snippet.lineStart, snippet.text, snippet.gitBranch)
    );
  }

  return displayMessage;
};

const getReadableCodeBlock = (filePath: string, lineStart: number, snippetText: string, gitBranch: string) => {
  snippetText = highlightCode(snippetText);
  snippetText = addLineNumbers(lineStart, snippetText);

  let output = `<div class="bg-gray-900 border border-gray-600 rounded text-sm">`;

  if (gitBranch || filePath) {
    output += `<div class="flex flex-start items-center p-2 border-b border-gray-600">`;
    output += gitBranch ? `${GIT_ICON} <div class='mr-2' title='${gitBranch}'>${gitBranch}</div>` : ``;
    output += filePath ? `${FILE_ICON} <div title='${filePath}'>${filePath}</div>` : ``;
    output += `</div>\n`;
  }

  output += `${PRE_TAG_START}${snippetText}${PRE_TAG_END}`;

  output += `</div>`;

  return output;
};

const getSnippetTag = (snippetId: number) => {
  return `[snippet_${snippetId}]`;
};
