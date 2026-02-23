#!/bin/bash
set -e

COOKIE='crumb=BSHJBYot+OHGNTY3ZDg0MmU3OGUyYzQxOTliNmFlYTUyYjRkYzA3; Locked=XS+nIxKCDQ8ZWd9Oz9d357jGLmJR+Q9787a/KYA/ZP4=; ss_cvr=80396a46-0699-48d1-a9d4-b5e7ebffaca5|1771878026077|1771878026077|1771878026077|1; ss_cvt=1771878026077'
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'
BASE_URL='https://ranunculus-iris-9apj.squarespace.com'

# Create directories
mkdir -p css js images fonts

# Function to download with auth
download() {
    local url="$1"
    local output="$2"
    echo "Downloading: $url -> $output"
    curl -s -b "$COOKIE" -H "User-Agent: $UA" "$url" -o "$output" || echo "Failed: $url"
}

# Download main pages
echo "=== Downloading HTML pages ==="
download "$BASE_URL/" "index.html"
download "$BASE_URL/products" "products.html"
download "$BASE_URL/about" "about.html"
download "$BASE_URL/contact" "contact.html"

echo "=== Done ==="
