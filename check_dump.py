with open('dump.html', encoding='utf-8', errors='ignore') as f:
    content = f.read()

print('Dump length:', len(content))
root_pos = content.find('id="root"')
if root_pos != -1:
    print('Around root:', content[root_pos:root_pos+500])
