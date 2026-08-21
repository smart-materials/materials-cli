#!/bin/bash
set -euo pipefail

record_process() {
  exit_status=$?
  trap - EXIT
  printf 'RING3_PROCESS|{"version":1,"pid":%d,"ppid":%d,"command":"npm run lint && npm test && npm run artifact","cwd":"/var/tmp/ring3-work","exitStatus":%d}\n' \
    "$$" "${PPID}" "${exit_status}"
  exit "${exit_status}"
}
trap record_process EXIT

[ "${PWD}" = "/var/tmp/ring3-work" ]
if timeout 5 curl --noproxy "*" --silent --show-error https://api.github.com >/dev/null 2>&1; then
  echo "The candidate process reached the network." >&2
  exit 1
fi
echo "network=denied"
npm run lint
npm test
npm run artifact
