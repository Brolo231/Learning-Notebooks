#!/bin/bash

# Check if a notebook file is provided
if [ -z "$1" ]; then
    echo "Usage: ./convert_dark.sh <notebook_name>"
    exit 1
fi

NOTEBOOK=$1
OUTPUT_NAME="${NOTEBOOK%.ipynb}_dark.html"

# Convert notebook to HTML
jupyter nbconvert --to html --template classic --output "$OUTPUT_NAME" "$NOTEBOOK"

# Inject dark mode CSS into the HTML file
sed -i '' 's#</head>#<link rel="stylesheet" type="text/css" href="dark_theme.css"></head>#g' "$OUTPUT_NAME"

echo "✅ Converted $NOTEBOOK to dark mode: $OUTPUT_NAME"