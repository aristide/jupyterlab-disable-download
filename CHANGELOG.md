# Changelog

<!-- <START NEW CHANGELOG ENTRY> -->

## 2.0.0

- Upgraded to JupyterLab 4 compatibility
- Fixed command disabling mechanism to work with Lumino 2's `CommandRegistry` (replaced broken `delete _commands[id]` with Map-based removal and re-registration as hidden/disabled no-ops)
- Disabled commands: `notebook:copy-to-clipboard`, `filebrowser:download`, `docmanager:download`, `notebook:export-to-format`, `filebrowser:copy-download-link`, `fileeditor:copy`, `fileeditor:cut`
- Keyboard shortcut interception (Ctrl+C) for CSV, HTML, JSON viewers and file editors

<!-- <END NEW CHANGELOG ENTRY> -->

## 0.1.7

No merged PRs

## 0.1.6

No merged PRs

## 0.1.5

No merged PRs

## 0.1.4

No merged PRs

## 0.1.3

No merged PRs

## 0.1.2

No merged PRs

## 0.1.1

No merged PRs
