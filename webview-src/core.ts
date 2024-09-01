declare const acquireVsCodeApi: () => any;

const vscode = acquireVsCodeApi();

export function initializeCore() {
    window.addEventListener('paste', (event) => {
        const clipboardData = event.clipboardData?.getData('text/html') || '';
        const html = extractHighlightedHTML(clipboardData);

        vscode.postMessage({ command: 'sendHighlightedHTML', result: html });
    });

    window.addEventListener('message', (event) => {
        if (event.data.command === 'requestHighlightedHTML') {
            document.execCommand('paste');
        }
    });
}

function extractHighlightedHTML(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.innerHTML;
}

