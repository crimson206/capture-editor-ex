# Capture Editor

A VSCode extension to export your code as HTML while preserving the editor's syntax highlighting and styling.

## Features

- Export current file as HTML
- Export multiple files as HTML at once
- Preserves VSCode's syntax highlighting and editor style

## Usage

### Capture Single File

1. Open the file you want to capture
2. Choose one of these methods:
   - Right-click in editor and select `Capture Editor as HTML`
   - Open Command Palette (F1 or Ctrl+Shift+P) and run `Capture Editor: Capture Editor as HTML`

### Capture Multiple Files

1. Open Command Palette and run `Capture Editor: Capture Multiple Editors as HTML`
2. Enter file paths separated by commas
   - Example: `src/index.ts, test/main.js`
   - Use paths relative to workspace root

## Output

Captured files are saved in the same location as the original file with the format `[original-filename]_highlighted.html`