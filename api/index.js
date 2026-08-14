// Import the built Express app from the compiled server
const serverModule = require('../dist/server.cjs');
const app = serverModule.app || serverModule.default;

// Export as Vercel handler
module.exports = app || serverModule;
