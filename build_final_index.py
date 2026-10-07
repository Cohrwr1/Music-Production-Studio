with open('index.html', encoding='utf-8') as f:
    html = f.read()

with open('app_compiled.js', encoding='utf-8') as f:
    js_code = f.read()

import re

# Remove Babel CDN script tag from head
html = re.sub(r'<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/[^"]+"></script>\s*', '', html)

start_tag = '<script type="text/babel">'
end_tag = '</script>'

start_pos = html.find(start_tag)
end_pos = html.rfind(end_tag)

if start_pos != -1 and end_pos != -1:
    new_html = html[:start_pos] + '<script>\n' + js_code + '\n</script>' + html[end_pos + len(end_tag):]
    with open('index.html', 'w', encoding='utf-8') as out:
        out.write(new_html)
    print("SUCCESS! Replaced Babel script block with pre-compiled JavaScript!")
else:
    print("Could not find start or end tag for Babel script.")
