import { initializeCore } from './core';
import { initializeLogger, logToPage } from './logger';

// Initialize logger with developer mode setting
// This could be passed from VS Code extension
initializeLogger(true);

// Initialize core functionality with logging function
initializeCore(logToPage);