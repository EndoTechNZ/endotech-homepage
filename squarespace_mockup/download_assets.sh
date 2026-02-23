#!/bin/bash
set -e

COOKIE='crumb=BSHJBYot+OHGNTY3ZDg0MmU3OGUyYzQxOTliNmFlYTUyYjRkYzA3; Locked=XS+nIxKCDQ8ZWd9Oz9d357jGLmJR+Q9787a/KYA/ZP4=; ss_cvr=80396a46-0699-48d1-a9d4-b5e7ebffaca5|1771878026077|1771878026077|1771878026077|1; ss_cvt=1771878026077'
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'

mkdir -p css js images

download() {
    local url="$1"
    local output="$2"
    if [ ! -f "$output" ]; then
        echo "Downloading: $url"
        curl -sL -b "$COOKIE" -H "User-Agent: $UA" "$url" -o "$output" || echo "Failed: $url"
    else
        echo "Skipping (exists): $output"
    fi
}

echo "=== Downloading CSS files ==="
# Main CSS files
download "https://assets.squarespace.com/universal/styles-compressed/commerce-cd03de9d0d7f1f57-min.en-US.css" "css/commerce.css"
download "https://assets.squarespace.com/universal/styles-compressed/user-account-core-deec763d109d5251-min.en-US.css" "css/user-account-core.css"
download "https://definitions.sqspcdn.com/website-component-definition/static-assets/website.components.form/67320b60-5a07-4f26-99ff-c0ddce10f301_393/website.components.form.styles.css" "css/form.css"
download "https://definitions.sqspcdn.com/website-component-definition/static-assets/website.components.imageFluid/4b15db79-88f5-43c7-9ac9-b438bef03262_209/website.components.imageFluid.styles.css" "css/imageFluid.css"
download "https://definitions.sqspcdn.com/website-component-definition/static-assets/website.components.shape/e46f1692-1af6-42a7-a0b0-f60f7d0a63c2_616/website.components.shape.styles.css" "css/shape.css"
download "https://static1.squarespace.com/static/versioned-site-css/6982bffd65e30003dcc30a7d/47/5c5a519771c10ba3470d8101/6982bffd65e30003dcc30ab7/1742/site.css" "css/site.css"
download "https://static1.squarespace.com/static/vta/5c5a519771c10ba3470d8101/versioned-assets/1771441478242-2KJ6E4XSE8IDDFKSAHZS/static.css" "css/static.css"

echo "=== Downloading JS files ==="
download "https://assets.squarespace.com/@sqs/polyfiller/1.6/legacy.js" "js/legacy.js"
download "https://assets.squarespace.com/@sqs/polyfiller/1.6/modern.js" "js/modern.js"
download "https://assets.squarespace.com/universal/scripts-compressed/cldr-resource-pack-7a2fb19c02b976ee-min.en-US.js" "js/cldr-resource-pack.js"
download "https://assets.squarespace.com/universal/scripts-compressed/commerce-54a300ea737ac101-min.en-US.js" "js/commerce.js"
download "https://assets.squarespace.com/universal/scripts-compressed/common-b57cad8386633f56-min.en-US.js" "js/common.js"
download "https://assets.squarespace.com/universal/scripts-compressed/common-vendors-e53e61d033c6b73f-min.en-US.js" "js/common-vendors.js"
download "https://assets.squarespace.com/universal/scripts-compressed/common-vendors-stable-fbd854d40b0804b7-min.en-US.js" "js/common-vendors-stable.js"
download "https://assets.squarespace.com/universal/scripts-compressed/extract-css-moment-js-vendor-6f2a1f6ec9a41489-min.en-US.js" "js/moment-js-vendor.js"
download "https://assets.squarespace.com/universal/scripts-compressed/extract-css-runtime-e16808bb04314e1e-min.en-US.js" "js/extract-css-runtime.js"
download "https://assets.squarespace.com/universal/scripts-compressed/performance-bc4a73425861a466-min.en-US.js" "js/performance.js"
download "https://assets.squarespace.com/universal/scripts-compressed/user-account-core-d7447d1742d8f0c9-min.en-US.js" "js/user-account-core.js"
download "https://static1.squarespace.com/static/vta/5c5a519771c10ba3470d8101/scripts/site-bundle.ffb22c3e841b638295ea13d0eb1a9f48.js" "js/site-bundle.js"

echo "=== Downloading images ==="
download "https://images.squarespace-cdn.com/content/v1/6982bffd65e30003dcc30a7d/bda90025-6988-4b0f-bde4-b1108ca66945/LOGO+-+EndoTech+Singapore.png" "images/logo.png"
download "https://images.squarespace-cdn.com/content/v1/6982bffd65e30003dcc30a7d/f6f05207-1f8e-428c-9128-8b80eb106772/LOGO+-+EndoTech+Singapore+-+with+Shaddow.png" "images/logo-shadow.png"
download "https://images.squarespace-cdn.com/content/v1/6982bffd65e30003dcc30a7d/04587396-e6c2-40e5-b745-5fa83ee2a8c8/LOGO+-+EndoTech+Singapore+-+with+Shaddow%28download%29.png" "images/logo-shadow-download.png"
download "https://images.squarespace-cdn.com/content/v1/6982bffd65e30003dcc30a7d/b227a2d2-98bc-4a31-a1c3-967a4e23d2bf/FULL.png" "images/full.png"
download "https://images.squarespace-cdn.com/content/v1/6982bffd65e30003dcc30a7d/503a9107-2e48-4a17-a58b-224deb38d0d8/Untitled-1.png" "images/untitled-1.png"
download "https://images.squarespace-cdn.com/content/v1/6982bffd65e30003dcc30a7d/f05436f0-aec3-4d23-b397-0f491a2d97e0/File+MASTER+-+with+Shaddow.png" "images/file-master.png"

echo "=== Done ==="
