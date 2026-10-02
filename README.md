# dsh-vechkabaz

DeepSeek Harness (`dsh`) bundle for ai.vechkabaz.com: adds the `coder-max` model, points
`web_search` / `web_fetch` at the server (dsh's default search needs a DeepSeek API key), and
adds memory: the same notes the pi package keeps, recalled per turn and saved with the `memory`
tool or picked up from finished sessions. Memory only runs on models hosted on the server itself.

## Install (no terminal)

1. In DeepSeek Harness, click **Plugins** in the sidebar → **Add plugin**.
2. Paste `github:Vcvzgbzz/dsh-vechkabaz` → **Install** → **Enable now**.
3. Open **Settings → Models → Vechkabaz**, paste your API key from ai.vechkabaz.com, save.

## Turning features on and off

**Plugins → dsh-vechkabaz** lists Web search, Subagents and Memory, each with its own switch.
Off hides those tools from the model right away, open sessions included.

## Install (terminal)

```sh
dsh plugin --profile web add github:Vcvzgbzz/dsh-vechkabaz
echo 'VECHKABAZ_API_KEY=<your key>' >> ~/.dsh/.env
```

Restart dsh after installing or updating.
