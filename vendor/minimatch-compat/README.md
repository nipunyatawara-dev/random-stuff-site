This compatibility adapter is used only by development lint tooling whose manifests
still request vulnerable minimatch 3/10. All glob parsing and matching is delegated
to the maintained, patched minimatch 11 engine, installed under an npm alias. It
exposes the legacy callable CommonJS export alongside modern named exports.

No vendor parser is forked, and node_modules is not patched. The glob contract is
covered in src/lib/glob-compat.test.ts and the complete ESLint run. Remove the
override when the upstream lint packages adopt the patched engine/API. Runtime
application code does not import this package.
