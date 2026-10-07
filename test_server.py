import urllib.request

try:
    with urllib.request.urlopen('http://localhost:3000/') as resp:
        html = resp.read().decode('utf-8')
        print('HTTP Status:', resp.status)
        print('Contains root element:', '<div id="root"></div>' in html)
        print('Contains Babel script:', '<script type="text/babel">' in html)
        print('HTML length:', len(html))
except Exception as e:
    print('Server Error:', e)
