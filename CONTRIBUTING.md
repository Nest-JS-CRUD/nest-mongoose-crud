# Contributing to nest-mongoose-crud

Thanks for your interest in contributing.

This project is a TypeScript library for NestJS + Mongoose CRUD workflows. The repository also includes an integration app used to validate library behavior end to end.

## What to contribute

We welcome:

- Bug fixes in the library behavior
- Tests (unit and integration-oriented)
- Documentation improvements
- Examples that clarify usage patterns
- Focused feature additions that fit the library scope

Please open an issue first for larger features or breaking API changes so we can align on direction before implementation.

## Repository structure

- `package/`: publishable library source (`nest-mongoose-crud`)
- `test-project/`: local integration app for trying and validating changes
- `dist/`: generated build output artifacts
- `README.md`: project usage docs

For most code changes, you will touch `package/src/**` and then validate behavior in `test-project`.

## Local setup

Prerequisites:

- Node.js LTS
- npm

Install dependencies in both work areas:

```bash
cd package
npm install

cd ../test-project
npm install
```

Build the library:

```bash
cd package
npm run build
```

Run the integration app:

```bash
cd test-project
npm run start:dev
```

## Development workflow

1. Make your change in `package/src/**`.
2. Rebuild the package (`cd package && npm run build`).
3. Validate behavior in `test-project` (run the app and test relevant endpoints/flows).
4. Run tests and checks before opening a PR.

When changing public behavior or API shape, update docs in `README.md` and ensure examples still match exported symbols from `package/src/index.ts`.

## Coding patterns and conventions

- Use TypeScript with clear types where practical.
- Follow existing NestJS patterns (decorators, DI, module/service/controller layout).
- Keep file names in kebab-case and classes/types in PascalCase.
- Prefer extending `BaseCrudService` and using `createCrudController` for consistency with existing architecture.
- Keep changes minimal and focused. Avoid unrelated refactors in the same PR.

## Testing expectations

Run relevant checks for the area you changed.

If you changed `package/`:

```bash
cd package
npm run build
npm run test
```

If you changed `test-project/`:

```bash
cd test-project
npm run lint
npm run test
npm run test:e2e
```

If your change affects query behavior, manually validate API features such as:

- filtering
- sorting
- pagination
- searching
- population

## Change impact guide

Use this to decide what to update in your PR:

- Package internals only:
  - Update `package/src/**`
  - Run `package` build/tests
- Public API behavior or exports:
  - Update `package/src/**`
  - Update docs in `README.md`
  - Verify examples align with real exports from `package/src/index.ts`
- Integration-only changes:
  - Update `test-project/**`
  - Run `test-project` lint/tests/e2e

## Pull request guidelines

Before opening a PR:

- Create a focused branch for one logical change
- Keep commits clear and scoped
- Include a clear PR description:
  - what changed
  - why it changed
  - how it was tested
  - whether it is breaking

If your PR is not ready, open it as draft early for feedback.

## Pre-submission checklist

- [ ] Code builds successfully in affected workspace(s)
- [ ] Relevant tests pass (`package` and/or `test-project`)
- [ ] Lint/format checks pass for changed files
- [ ] README/docs updated when behavior or API changed
- [ ] Examples and docs match actual implementation and exports
- [ ] No debug logs left (`console.log`) and no commented-out dead code
- [ ] PR description includes a clear test plan

## Publishing notes

Publishing is handled from `package/`. For release details, refer to:

- `package/PUBLISHING.md`
- `package/QUICK_PUBLISH.md`

Contributors should not bump package versions unless explicitly requested by maintainers for a release PR.

## Communication

Keep discussion in issues/PRs so decisions are visible and searchable.

If you do not hear back on a PR after several days, a polite follow-up comment is welcome.
