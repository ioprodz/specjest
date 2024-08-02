# 😎 SpecJest

## 🧩 Features:

⏩ Convert gherkin (.feature) to a todo test file

```bash
npm specjest test <path/to/file.feature>
```

⏩ Convert behavioural jest tests to a gherkin (.feature)

⚙️ Run all tests and generate feature files:

```bash
npm jest --json | npm specjest feat
```

⚙️ To generate for specific path or test pattern:

```bash
npm jest <testRegex> --json | npm specjest feat
```

Note: depending on your pacakge.json configuration, you may need to adjust these commands to take into consideration the project's jest configuration.
