import re

with open('index.html', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'<script type="text/babel">(.*?)</script>', content, re.DOTALL)
if match:
    code = match.group(1)
    with open('temp_script.jsx', 'w', encoding='utf-8') as out:
        out.write(code)
    print(f"Extracted Babel script, {len(code)} characters.")
else:
    print("No babel script found!")
