.PHONY: dev kill

SESSION_NAME=woohoo

dev:
	@if tmux has-session -t $(SESSION_NAME) 2>/dev/null; then \
		tmux attach -t $(SESSION_NAME); \
	else \
		tmux new-session -d -s $(SESSION_NAME) "cd web && clear && npm run dev" \; \
		split-window -h -t 0 "zsh" \; \
		select-pane -t 0 \; \
		split-window -v -t 0 "cd ext && clear && npm run dev" \; \
		select-pane -t 1; \
		tmux attach -t $(SESSION_NAME); \
	fi

kill:
	tmux kill-session -t $(SESSION_NAME) || true
