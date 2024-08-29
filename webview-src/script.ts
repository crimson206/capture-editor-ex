declare const acquireVsCodeApi: () => any;

const vscode = acquireVsCodeApi();

function logToPage(message: string) {
    const logElement = document.getElementById('log');
    if (logElement) {
        logElement.innerHTML += `${message}<br>`;
    }
}

window.addEventListener('paste', (event) => {
    logToPage('Paste event triggered');
    const clipboardData = event.clipboardData?.getData('text/html') || '';
    logToPage(`Clipboard data: ${clipboardData}`);
    const html = extractHighlightedHTML(clipboardData);
    logToPage(`Extracted HTML: ${html}`);
    vscode.postMessage({ command: 'sendHighlightedHTML', result: html });
});

window.addEventListener('message', (event) => {
    logToPage(`Received message: ${JSON.stringify(event.data)}`);
    if (event.data.command === 'requestHighlightedHTML') {
        logToPage('Executing paste command');
        document.execCommand('paste');
    }
});

function extractHighlightedHTML(html: string): string {
    logToPage('Starting HTML extraction');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    logToPage(`Parsed document: ${doc.body.innerHTML}`);
    return doc.body.innerHTML;
}