import urllib.request, json

url = 'https://script.google.com/macros/s/AKfycbzD8tSq5esdph6EtAlGM73d0csC6Ev5l_NjmhAfIlPKeTwGpJQNfI_6kun5bcDBHXPc/exec'

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8')
        print('HTTP Status:', resp.status)
        print('Response Length:', len(content))
        data = json.loads(content)
        print('JSON Keys:', data.keys())
        print('Data rows returned:', len(data.get('data', [])))
        for idx, row in enumerate(data.get('data', [])[:10]):
            print(f"Row {idx}: {row}")
except Exception as e:
    print('GET Error:', e)
