#!/bin/bash
# Script to rebuild hero1.html with full inlined SVG content

set -e

HTML_FILE="hero1.html"
TEMP_HTML="/tmp/hero1_new.html"
TOP_RIGHT_INNER="/tmp/top-right-inner.svg"
BOTTOM_LEFT_INNER="/tmp/bottom-left-inner.svg"

echo "Building new ${HTML_FILE} with full SVG content..."

# Create header section (everything before first SVG)
sed -n '1,105p' "${HTML_FILE}" > "${TEMP_HTML}"

# Add the top-right SVG opening tag
cat >> "${TEMP_HTML}" << 'EOF'
        <!-- Inline top-right SVG -->
        <svg class="hero-svg hero-svg-top-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4661.47 2543.89">
    <defs>
        <style>
            .cls-1 { fill: #fff; }
        </style>
    </defs>
    <!-- Full top-right-new.svg content begins -->
EOF

# Add the top-right SVG inner content
cat "${TOP_RIGHT_INNER}" >> "${TEMP_HTML}"

# Close top-right SVG
cat >> "${TEMP_HTML}" << 'EOF'
    <!-- Full top-right-new.svg content ends -->
</svg>

        <!-- Inline bottom-left SVG -->
        <svg class="hero-svg hero-svg-bottom-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4661.47 2582.89">
    <defs>
        <style>
            .cls-1 { fill: #fff; }
        </style>
    </defs>
    <!-- Full bottom-left-new.svg content begins -->
EOF

# Add the bottom-left SVG inner content
cat "${BOTTOM_LEFT_INNER}" >> "${TEMP_HTML}"

# Close bottom-left SVG and add closing HTML
cat >> "${TEMP_HTML}" << 'EOF'
    <!-- Full bottom-left-new.svg content ends -->
</svg>
    </section>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
EOF

# Replace original file
mv "${TEMP_HTML}" "${HTML_FILE}"

echo "✓ ${HTML_FILE} updated with full SVG content"
