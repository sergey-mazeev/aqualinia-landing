#!/usr/bin/env bash
# Smoke test for POST /api/leads against a running server.
# Usage: BASE_URL=http://localhost:3000 bash scripts/smoke.sh
set -euo pipefail
BASE_URL="${BASE_URL:-http://localhost:3000}"
RUN="$(date +%s)"
pass=0; fail=0

now_ms() { node -e 'console.log(Date.now())'; }
uuid() { node -e 'console.log(crypto.randomUUID())'; }

post() { # $1 = ip suffix, $2 = json body → prints "status body"
  curl -s -o /tmp/smoke-body.$$ -w "%{http_code}" -X POST "$BASE_URL/api/leads" \
    -H "content-type: application/json" -H "x-real-ip: 10.$RUN.$1" --data "$2"
}

check() { # $1 = name, $2 = expected status, $3 = actual status, [$4 = grep pattern in body]
  local body; body="$(cat /tmp/smoke-body.$$)"
  if [[ "$3" == "$2" && ( -z "${4:-}" || "$body" == *"$4"* ) ]]; then
    echo "  ok   $1 ($3)"; pass=$((pass+1))
  else
    echo "  FAIL $1: expected $2 ${4:-}, got $3 $body"; fail=$((fail+1))
  fi
}

lead() { # $1 = extra json fields
  local started=$(( $(now_ms) - 5000 ))
  echo "{\"name\":\"Смоук Тест\",\"phone\":\"8 (999) 123-45-67\",\"contactMethod\":\"call\",\"consent\":true,\"source\":\"final\",\"locale\":\"ru\",\"startedAt\":$started,\"clientSubmissionId\":\"$(uuid)\",\"attribution\":{\"utmSource\":\"smoke\"}${1:+,$1}}"
}

echo "Smoke: $BASE_URL"
# Wait up to 30 s for the server to come up (e.g. a freshly started container).
for _ in $(seq 1 30); do curl -sf -o /dev/null "$BASE_URL/api/health" && break; sleep 1; done
s=$(post 1 "$(lead)"); check "valid lead" 201 "$s" '"id"'
s=$(post 2 "$(lead '"consent":false')"); check "no consent" 400 "$s" consent_required
s=$(post 3 "$(lead '"phone":"12345"')"); check "bad phone" 400 "$s" phone_invalid
s=$(post 4 "$(lead '"website":"http://spam.example"')"); check "honeypot" 200 "$s"
s=$(post 5 "$(lead "\"startedAt\":$(now_ms)")"); check "too fast" 200 "$s"
s=$(post 6 "$(lead '"source":"product","productSku":"NOPE"')"); check "unknown sku" 400 "$s" productSku
s=$(post 7 "$(lead '"source":"product","productSku":"F-TRIO-STD","quantity":2')"); check "product order" 201 "$s"
s=$(post 8 "$(lead '"source":"quiz","quizAnswers":{"format":"pitcher","problem":"hardness","people":"1-2","budget":"low"}')"); check "quiz lead" 201 "$s"
dup="$(lead)"
s=$(post 9 "$dup"); check "idempotent #1" 201 "$s"
s=$(post 10 "$dup"); check "idempotent #2" 200 "$s"
# Keep posting from one IP until the limiter kicks in (limit is 5 by default, LEAD_RATE_LIMIT overrides).
s=000; for i in $(seq 1 "${MAX_RATE_TRIES:-60}"); do s=$(post 11 "$(lead)"); [[ "$s" == 429 ]] && break; done
check "rate limit" 429 "$s" rate_limited
s=$(curl -s -o /tmp/smoke-body.$$ -w "%{http_code}" "$BASE_URL/api/health"); check "health" 200 "$s" '"ok":true'

rm -f /tmp/smoke-body.$$
echo "passed: $pass, failed: $fail"
[[ $fail -eq 0 ]]
