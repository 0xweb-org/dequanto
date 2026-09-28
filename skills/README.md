# Install The Dequanto Skill

The portable skill is the complete [dequanto](dequanto/) directory. It includes `SKILL.md`, `INDEX.md`, `references/`, and `examples/`. It can stay in this repository; no separate repository or server is needed.

## Install From This Checkout

Run from the dequanto repository root in PowerShell:

```powershell
# Codex: available across your projects.
New-Item -ItemType Directory -Force "$HOME/.agents/skills" | Out-Null
Copy-Item -Recurse ./skills/dequanto "$HOME/.agents/skills/"
```

For a project-specific Codex installation, copy the folder to `<project>/.agents/skills/dequanto`. For Claude Code, use `<project>/.claude/skills/dequanto`. Copy the entire folder, including its resources.

Use a destination where `dequanto` does not already exist. When updating, replace the previous skill directory with the new complete directory so removed resources do not remain.

In Codex, invoke `$dequanto` or let Codex select it for relevant tasks. Restart Codex if the installed skill does not appear. See the [Codex skill documentation](https://learn.chatgpt.com/docs/build-skills).

## Install From GitHub With Codex

After the skill directory has been committed and pushed, ask Codex:

```text
$skill-installer Install the dequanto skill from
https://github.com/0xweb-org/dequanto/tree/master/skills/dequanto
```

Installation provides agent instructions and examples. Install the `dequanto` npm dependency separately in the project where you use it. Examples run as tests inside the dequanto repository. In other projects, adapt their generated-contract imports and fixture paths; see the skill index for prerequisites.

## Maintain And Test

Edit `skills/dequanto/SKILL.md`, `INDEX.md`, `references/`, and `examples/` directly. This directory is the single source of truth and the installable skill; no bundling or synchronization step is needed.

Use published `dequanto/...` imports. The repository test runner maps them to `src/...` through `tsconfig-build.json`, so examples exercise the current source.

Run a focused example from the repository root:

```sh
npx atma test skills/dequanto/examples/hardhat-debug.spec.ts
npm run typecheck -- --pretty false
```

Examples using forks require RPC access; deployment and generation examples may also require the repository fixtures and Hardhat configuration.
