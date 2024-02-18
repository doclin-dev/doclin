export const MULTIPLE_LINE_BREAK_REGEX: RegExp = /(<p><br><\/p>)+/gi;
export const SINGLE_LINE_BREAK: string = '<p><br></p>';

export const getSnippetTag = (snippetId: number) => {
	return `[snippet_${snippetId}]`;
};

export const fillUpThreadOrReplyMessageWithSnippet = (message: string, snippetblots: any[]) => {
	for (const snippet of snippetblots) {
		message = message.replace(
			getSnippetTag(snippet.index), 
			`\nIn ${snippet.filePath}:\n<pre>${snippet.originalSnippet}</pre>\n`
		);
	}

	return message;
};