#!/usr/bin/env bash
set -euo pipefail # fail fast on errors

# ------------------------------------------------------------------------------
# Usage:
#   ./generateSef.bash DEPLOYED_BASE_URL
#
# DEPLOYED_BASE_URL - The URL at which the web application is available at,
#     e.g. http://localhost:5173
#
# Generate a compiled SEF JSON file from the latest version of the swiML XSL
# file which is to be deployed at `DEPLOYED_BASE_URL`.
# ------------------------------------------------------------------------------

deployed_base_url=$1

readonly MASTER_XSL_URL=https://raw.githubusercontent.com/bartneck/swiML/refs/heads/main/swiML.xsl
readonly SEF_FILE_NAME=swiML.sef.json
readonly STATIC_HTTP_DIR=public

xsl_file_name=$(basename "${MASTER_XSL_URL}")
xsl_file_path="./${STATIC_HTTP_DIR}/${xsl_file_name}"
sef_file_path="./${STATIC_HTTP_DIR}/${SEF_FILE_NAME}"
static_http_uri="file://$(cd "${STATIC_HTTP_DIR}" && pwd -P)"

# Download the latest version of the swiML XSL transformation schema
if [ ! -f "${xsl_file_path}" ]; then
    curl --fail ${MASTER_XSL_URL} >"${xsl_file_path}"
fi

# Compile it into a SEF JSON file
if [ ! -f "${sef_file_path}" ]; then
    node node_modules/xslt3/xslt3.js -xsl:"${xsl_file_path}" -export:"${sef_file_path}" -t -ns:##html5 -nogo
fi

# Replace references to the XSL file with the hosted instance
temp_file=$(mktemp "${sef_file_path}.XXXXXX")
sed "s&${static_http_uri}&${deployed_base_url}&g" "${sef_file_path}" >"${temp_file}"
mv "${temp_file}" "${sef_file_path}"
echo "Replaced occurrence of ${static_http_uri} with ${deployed_base_url}"

# Calculate what the checksum should be for the updated sef json
new_checksum=$(./scripts/computeChecksum.ts "${sef_file_path}")

# Replace the Σ field using jq
#    The property name is the Greek capital sigma (U+03A3).
#    In jq we can refer to it as "\u03A3".
temp_file=$(mktemp "${sef_file_path}.XXXXXX")
jq --arg cs "${new_checksum}" '.["\u03A3"] = $cs' "${sef_file_path}" >"${temp_file}"

# Overwrite the original file with the temporary file
mv "${temp_file}" "${sef_file_path}"
echo "Updated checksum"
