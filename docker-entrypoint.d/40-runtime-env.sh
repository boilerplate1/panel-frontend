#!/bin/sh
set -eu

json_escape() {
  printf '%s' "${1:-}" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

cat > /usr/share/nginx/html/env.js <<EOF
window.__HYPEX_CONFIG__ = {
  VITE_API_URL: "$(json_escape "${VITE_API_URL:-}")",
  VITE_TURNSTILE_SITE_KEY: "$(json_escape "${VITE_TURNSTILE_SITE_KEY:-}")",
  VITE_ANDROID_APK_URL: "$(json_escape "${VITE_ANDROID_APK_URL:-}")",
  VITE_BASE_URL: "$(json_escape "${VITE_BASE_URL:-}")"
};
EOF
