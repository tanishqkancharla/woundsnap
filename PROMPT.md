Pick the first thing off @TODO.md and do it.

For the todo, start by thoroughly researching and writing your notes into `docs/todos/<todo-name>.md`.

After researching and making a spec about how to do the task, do it. After its done, update the spec about what was completed and how far you got.

If you run into implementation issues or confusing debugging reasons, use the Oracle to debug. It's really smart.

After you finish, always test and verify your changes using the Playwright MCP server. You should run the `dev_server.sh` script to start and stop the dev server. Always run playwright tests using a sub-agent.

IMPORTANT: Only use a sub-agent to perform a single test for you. Do NOT ask it to write a test suite. The sub-agent's only goal is to take your instructions and perform them in the web app and report back what happens, including screenshots if requested.

IMPORTANT: DO NOT tell the sub-agent to start the dev_server. Once it's already started it does not need to be started again until it is stopped. The sub-agent's ONLY job is to perform the given playwright test. If it fails, it should return immediately to the main agent and should NOT try to fix the error or issue -- that is the main agent's job

After you're done, update the todo in @TODO.md. If it was completed, use an "x". If you got blocked or only made some progress, use "-" Add a status update under the todo itself, and add a pointer to the todo docs file. If you got blocked by something, put the reason why in the status update and expand on it in the todo file.

If there is leftover work to do, add it to the docs file in a "Progress" section. Then add or update any TODOs in the TODO.md file to finish it back up. Make sure the todo description is a full one or two sentences, detailing any context someone will need to know to pick up the task.

Finally, commit and push your changes in Git.
