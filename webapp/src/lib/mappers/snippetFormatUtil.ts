import hljs from 'highlight.js';

hljs.configure({
  languages: ['javascript', 'python', 'cpp', 'ruby', 'php', 'html', 'typescript'],
});

export const highlightCode = (snippetText: string): string => {
  const highlight = hljs.highlightAuto(decodeHtmlEntities(snippetText));
  return highlight.value;
};

export const decodeHtmlEntities = (encodedString: string) => {
  return encodedString.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
};

export const addLineNumbers = (lineStart: number, snippetText: string): string => {
  if (!lineStart) {
    lineStart = 1;
  }

  const lines = snippetText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = formatNumber(lineStart + i, 2);
    lines[i] = `<span class="line-number">${lineNumber}</span>  ${lines[i]}`;
  }

  return lines.join('\n');
};

const formatNumber = (num: number, length: number) => {
  return num.toString().padStart(length, ' ');
};
