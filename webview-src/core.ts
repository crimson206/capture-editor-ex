declare const acquireVsCodeApi: () => any;

const vscode = acquireVsCodeApi();

export type LogFunction = (title: string, content: string, sanitize?: boolean) => void;

export function initializeCore(logFn: LogFunction) {
    window.addEventListener('paste', (event) => {
        logFn('Paste event triggered', '');
        const clipboardData = event.clipboardData?.getData('text/html') || '';
        logFn('Clipboard data', clipboardData);
        const html = extractHighlightedHTML(clipboardData, logFn);

        logFn('Original Clipboard HTML', html, true);
        logFn('Extracted HTML', html);
        vscode.postMessage({ command: 'sendHighlightedHTML', result: html });
    });

    window.addEventListener('message', (event) => {
        logFn('Received message', JSON.stringify(event.data));
        if (event.data.command === 'requestHighlightedHTML') {
            logFn('Executing paste command', '');
            document.execCommand('paste');
        }
    });
}

function extractHighlightedHTML(html: string, logFn: LogFunction): string {
    logFn('Starting HTML extraction', '');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    logFn('Parsed document', doc.body.innerHTML);
    return doc.body.innerHTML;
}

