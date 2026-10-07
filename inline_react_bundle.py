import urllib.request

print("Downloading React UMD production scripts...")

react_url = "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"
react_dom_url = "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"

req1 = urllib.request.Request(react_url, headers={'User-Agent': 'Mozilla/5.0'})
react_code = urllib.request.urlopen(req1).read().decode('utf-8')

req2 = urllib.request.Request(react_dom_url, headers={'User-Agent': 'Mozilla/5.0'})
react_dom_code = urllib.request.urlopen(req2).read().decode('utf-8')

print(f"React JS size: {len(react_code)} bytes")
print(f"ReactDOM JS size: {len(react_dom_code)} bytes")

with open('index.html', encoding='utf-8') as f:
    html = f.read()

target = '<!-- React & Babel UMD via Cloudflare CDN -->'
pos = html.find(target)
if pos != -1:
    end_script_pos = html.find('<link rel="stylesheet"', pos)
    if end_script_pos != -1:
        inlined_block = f'''<!-- 100% Standalone Self-Contained React Engine -->
  <script>
{react_code}
  </script>
  <script>
{react_dom_code}
  </script>
  '''
        new_html = html[:pos] + inlined_block + html[end_script_pos:]
        with open('index.html', 'w', encoding='utf-8') as out:
            out.write(new_html)
        print("SUCCESS! Inlined React and ReactDOM into index.html!")
else:
    print("Could not find CDN marker in index.html!")
