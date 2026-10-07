import json
import re

with open('ws_output.json', encoding='utf-8', errors='ignore') as f:
    raw = f.read()

# Find JSON object in raw WS frame
match = re.search(r'\{"id":1,"result":.*\}', raw)
if match:
    data = json.loads(match.group(0))
    val = data.get('result', {}).get('result', {}).get('value', '')
    print(f"Extracted JS value length: {len(val)}")
    if val.startswith('SUCCESS:\n'):
        compiled_code = val.replace('SUCCESS:\n', '')
        with open('app_compiled.js', 'w', encoding='utf-8') as js_file:
            js_file.write(compiled_code)
        print("SUCCESS! Wrote app_compiled.js successfully!")
    elif val.startswith('ERROR:\n'):
        print("Compilation ERROR from Babel:")
        print(val)
    else:
        print("Output sample:", val[:500])
else:
    print("Could not parse JSON from WS output. Raw sample:")
    print(raw[:500])
