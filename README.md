# dsh-vechkabaz

DeepSeek Harness (`dsh`) bundle for ai.vechkabaz.com: adds the `coder-max` model and points
`web_search` / `web_fetch` at the server (dsh's default search needs a DeepSeek API key).

## Install

```sh
npm i -g @deepseek-ai/dsh
dsh plugin --profile web add github:Vcvzgbzz/dsh-vechkabaz
echo 'VECHKABAZ_API_KEY=<your key>' >> ~/.dsh/.env
dsh web
```

Use `--profile headless` instead of `web` for one-shot runs: `dsh --profile headless "task"`.
Restart dsh after installing or updating the bundle.
