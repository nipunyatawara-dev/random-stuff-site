/* eslint-disable @typescript-eslint/no-require-imports -- This adapter supplies the legacy CommonJS API. */
// Older ESLint plugins call require('minimatch') directly. Modern consumers use
// named exports. Expose both contracts while using the patched v11 engine.
const engine = require('minimatch-engine');
function callable(path, pattern, options) { return engine.minimatch(path, pattern, options); }
Object.assign(callable, engine);
callable.defaults = engine.defaults;
module.exports = callable;
