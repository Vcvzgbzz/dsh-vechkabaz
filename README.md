# dsh-vechkabaz

DeepSeek Harness (`dsh`) bundle for ai.vechkabaz.com: adds the `coder-max` model and points
`web_search` / `web_fetch` at the server (dsh's default search needs a DeepSeek API key).

## Install (no terminal)

1. In DeepSeek Harness, click **Plugins** in the sidebar → **Add plugin**.
2. Paste `github:Vcvzgbzz/dsh-vechkabaz` → **Install** → **Enable now**.
3. Open **Settings → Models → Vechkabaz**, paste your API key from ai.vechkabaz.com, save.

## Install (terminal)

```sh
dsh plugin --profile web add github:Vcvzgbzz/dsh-vechkabaz
echo 'VECHKABAZ_API_KEY=<your key>' >> ~/.dsh/.env
```

Restart dsh after installing or updating.
