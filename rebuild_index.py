with open('index.html', encoding='utf-8') as f:
    html = f.read()

with open('app_compiled.js', encoding='utf-8') as f:
    js_code = f.read()

start_pos = html.find('<script>')
end_pos = html.rfind('</script>')

if start_pos != -1 and end_pos != -1:
    new_html = html[:start_pos] + '<script>\n' + js_code + '\n</script>\n</body>\n</html>'
    with open('index.html', 'w', encoding='utf-8') as out:
        out.write(new_html)
    print("SUCCESSFULLY REBUILT index.html with live background polling & 1-click header sync!")
else:
    print("Error: Could not locate script tags.")
