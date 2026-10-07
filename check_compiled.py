with open('compiled_output.txt', encoding='utf-8', errors='ignore') as f:
    content = f.read()

print('Compiled output file length:', len(content))
if 'SUCCESS:' in content:
    print('Compilation was SUCCESSFUL!')
    success_idx = content.find('SUCCESS:')
    compiled_js = content[success_idx + len('SUCCESS:'):]
    # Clean HTML tags if dumped as DOM
    from bs4 import BeautifulSoup
    try:
        soup = BeautifulSoup(content, 'html.parser')
        out_div = soup.find(id='output')
        if out_div:
            compiled_js = out_div.text.replace('SUCCESS:\n', '')
    except Exception as e:
        pass
    
    with open('app_compiled.js', 'w', encoding='utf-8') as js_out:
        js_out.write(compiled_js)
    print(f'Saved app_compiled.js ({len(compiled_js)} bytes)')
elif 'ERROR:' in content:
    print('Compilation HAD ERROR!')
    err_idx = content.find('ERROR:')
    print(content[err_idx:err_idx+500])
else:
    print('Neither SUCCESS nor ERROR found in dump. Content sample:')
    print(content[:500])
