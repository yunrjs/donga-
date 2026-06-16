# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo contains two unrelated things:

- `index.html` — a standalone static website (Korean hospital site, "동아병원"). Self-contained single file; no build step.
- `task-manager/` — a TypeScript CLI project. This is the active development project and the focus below.

## task-manager

A CLI task manager. Tasks are persisted to `task-manager/tasks.json` as a JSON array; there is no database or server. Node.js v18+, TypeScript strict mode.

### Commands

Run all commands from inside `task-manager/`:

- Install deps: `npm install`
- Run the CLI: `npx ts-node index.ts <command> [args]`
- Type-check / build: `npx tsc`

CLI commands: `list`, `add <title>`, `done <id>`, `delete <id>`, `help`.
Example: `npx ts-node index.ts add "Write docs"`

There is no test suite or linter configured.

### Architecture

Two-file separation of concerns:

- `tasks.ts` — the data layer. Defines the `Task` interface and all persistence + mutation logic (`loadTasks`, `saveTasks`, `addTask`, `completeTask`, `deleteTask`). Every mutation reads the full list, modifies it, and writes the whole file back. IDs are assigned as `max(existing id) + 1`, so they are not reused after deletion. The data file path is resolved relative to `__dirname` (`tasks.json` sits next to the compiled/source module).
- `index.ts` — the presentation/CLI layer. Parses `process.argv`, dispatches on the command, formats output, and sets exit codes. It contains no persistence logic; it only calls into `tasks.ts`.

When adding a new command, wire it in both places: implement the data operation in `tasks.ts` and add a `case` to the `switch` in `index.ts`.

### Conventions

- `loadTasks()` is fault-tolerant by design: a missing or malformed `tasks.json` returns `[]` rather than throwing. Preserve this — never delete or recreate `tasks.json` on startup.
- Keep all file I/O in `tasks.ts`; `index.ts` stays I/O-free apart from console output.
