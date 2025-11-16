# Publish Checklist

This document tracks the steps needed to publish `@gaia-tools/coeus-api-client` to npm.

## Pre-Publish Validation

Before publishing, ensure all of the following are completed:

### ✅ Package Configuration

- [x] Package name updated to `@gaia-tools/coeus-api-client`
- [x] Package metadata (repository, license, keywords) added
- [x] `publishConfig` set to public access
- [x] `files` field includes only `dist` and `README.md`
- [x] `prepublishOnly` script configured
- [x] Dependencies cleaned up (removed local `@ouranos/aphrodite` reference)
- [x] Dev dependencies include all required tooling

### ✅ Build Configuration

- [x] `tsup.config.ts` created with proper settings
- [x] `tsconfig.json` is self-contained (no external extends)
- [x] `.eslintrc.json` configured
- [x] Build scripts updated to use tsup config

### ✅ Code Quality

- [x] Types polished and documented
- [x] Legacy types marked as deprecated
- [x] Exports properly organized
- [x] Bundle smoke test added

### ✅ Documentation

- [x] README.md updated with accurate information
- [x] Installation instructions updated
- [x] Usage examples provided
- [x] API documentation complete
- [x] `docs/GAIA_API_CLIENT.md` created

## Publishing Steps

1. **Install Dependencies**
   ```bash
   cd /home/emmy/git/gaia-api
   pnpm install
   ```

2. **Run Linting**
   ```bash
   pnpm lint
   ```
   Should pass with no errors.

3. **Run Tests**
   ```bash
   pnpm test
   ```
   All tests should pass.

4. **Build Package**
   ```bash
   pnpm build
   ```
   Should generate `dist/` directory with:
   - `index.js` (CommonJS)
   - `index.mjs` (ES Modules)
   - `index.d.ts` (TypeScript declarations)
   - Source maps

5. **Dry Run Package**
   ```bash
   pnpm pack
   ```
   This creates a tarball that you can inspect. Verify it contains:
   - `package.json`
   - `README.md`
   - `dist/` directory with all built files
   - No source files (`src/` should not be included)

6. **Update Version** (if needed)
   Edit `package.json` and update the version field following semantic versioning.

7. **Publish**
   ```bash
   npm publish
   ```
   Or if using pnpm:
   ```bash
   pnpm publish
   ```

## Post-Publish

- [ ] Verify package appears on npm: https://www.npmjs.com/package/@gaia-tools/coeus-api-client
- [ ] Test installation in a fresh project
- [ ] Update any documentation that references the package
- [ ] Create a git tag for the release (if using version control)

## Notes

- The `prepublishOnly` script will automatically run lint, test, and build before publishing
- Make sure you're logged into npm: `npm login`
- Ensure you have publish access to the `@gaia` scope on npm

