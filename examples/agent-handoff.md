# Agent handoff example

```sh
clipcase init
clipcase new failing-test --title "Failing auth regression"
npm test 2>&1 | clipcase add failing-test --source "npm test" --tag failure --tag auth
clipcase export failing-test --out handoff.md
```
