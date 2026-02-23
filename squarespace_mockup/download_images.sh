#!/bin/bash
COOKIE='crumb=BSHJBYot+OHGNTY3ZDg0MmU3OGUyYzQxOTliNmFlYTUyYjRkYzA3; Locked=XS+nIxKCDQ8ZWd9Oz9d357jGLmJR+Q9787a/KYA/ZP4=; ss_cvr=80396a46-0699-48d1-a9d4-b5e7ebffaca5|1771878026077|1771878026077|1771878026077|1; ss_cvt=1771878026077'
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'

mkdir -p images

download() {
    local url="$1"
    local output="$2"
    if [ ! -f "$output" ]; then
        echo "Downloading: $(basename "$output")"
        curl -sL -b "$COOKIE" -H "User-Agent: $UA" "$url" -o "$output" || echo "Failed: $url"
    fi
}

BASE="https://images.squarespace-cdn.com/content/v1/6982bffd65e30003dcc30a7d"

# Product images
download "$BASE/80b10f16-9876-4ddb-a25f-ca0275beb91d/04_Series_Thinner_Shank_TRANSPARENT.png" "images/04_Series_Thinner_Shank_TRANSPARENT.png"
download "$BASE/5aa0c3c4-0dd9-43c4-9aab-bf263a59c2b6/ET+Part+Numbers+-+Finished+-+3.png" "images/ET_Part_Numbers_Finished_3.png"
download "$BASE/e25cb668-f349-41f7-b519-66eb21c93d2e/UP+and+DOWN+ALL+-+long+-+TransformX_All_In_Single_Image_400dpi.png" "images/TransformX_All_In_Single_Image.png"
download "$BASE/4c0baf22-839e-4724-9549-e5dbbdc94d4b/PT+Part+Numbers+Finished+-+4.png" "images/PT_Part_Numbers_Finished_4.png"
download "$BASE/ca2258af-9fb7-4f3b-991c-f9d73ce70f88/Avatar+Tip+comparison+Transparent.png" "images/Avatar_Tip_comparison.png"
download "$BASE/712e4f3b-8b3a-4760-94b5-cfee4487fec7/Lets+you+get+to+working+length+and+full+shape.png" "images/Lets_you_get_to_working_length.png"
download "$BASE/53d0eae8-8c46-4d44-9bbb-4637ca8ac110/TransformX_ALL_CROPPED.png" "images/TransformX_ALL_CROPPED.png"
download "$BASE/e3b17188-0d51-4bfe-899b-75da06280f9e/Get+to+working+length+FASTER+and+with+less+separation+risk.png" "images/Get_to_working_length.png"
download "$BASE/eac54085-dff2-47fb-8cd4-07f50ef683af/04_Series_Thinner_Shank_TRANSPARENT.png" "images/04_Series_Thinner_Shank_2.png"
download "$BASE/b89e010d-dfb9-44bc-910d-e648407432c4/04_Series_Thinner_Shank_TRANSPARENT.png" "images/04_Series_Thinner_Shank_3.png"

# Logos already downloaded
echo "=== Image download complete ==="
