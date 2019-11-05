.PHONY: dev
dev: venv/bin/pip-sync requirements.txt
	venv/bin/pip-sync
requirements.txt: venv/bin/pip-compile requirements.in
	venv/bin/pip-compile \
	--no-index \
	--no-emit-trusted-host \
	requirements.in > requirements.txt
venv/bin/pip-compile venv/bin/pip-sync: venv
	venv/bin/pip install wheel pip-tools
venv:
	python3 -m venv venv
