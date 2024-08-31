let developerMode = false;

export function initializeLogger(initialDeveloperMode: boolean) {
    developerMode = initialDeveloperMode;
    addLogStyle();
}

export function logToPage(title: string, content: string, sanitize: boolean = false) {
    if (!developerMode) {
        return;
    }
    
    const logElement = document.getElementById('log');
    if (logElement) {
        const timestamp = new Date().toISOString();
        let outputTitle = `<span class="timestamp">[${timestamp}]</span> <span class="title">${title}</span>`;
        let outputContent = content;
        
        if (sanitize) {
            outputContent = outputContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        logElement.innerHTML += `<div class="log-entry">${outputTitle}<br><pre class="content">${outputContent}</pre></div>`;
        logElement.scrollTop = logElement.scrollHeight;
    }
}

function addLogStyle() {
    const style = document.createElement('style');
    style.textContent = `
        #log {
            font-family: 'Courier New', Courier, monospace;
            white-space: pre-wrap;
            padding: 10px;
            background-color: #ffffff;
            border: 1px solid #ccc;
            max-height: 300px;
            overflow-y: auto;
            font-size: 12px;
            line-height: 1.4;
        }
        .log-entry {
            margin-bottom: 10px;
        }
        .timestamp {
            color: #888;
        }
        .title {
            font-weight: bold;
            color: #0066cc;
        }
        .content {
            margin: 5px 0 0 20px;
            color: #333;
            background-color: #f8f8f8;
            padding: 5px;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);
}
