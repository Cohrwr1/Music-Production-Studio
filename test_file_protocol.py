import subprocess
import time
import urllib.request
import json
import socket, base64, os

edge_proc = subprocess.Popen([
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless",
    "--remote-debugging-port=9223",
    r"file:///C:/Users/Dell/.gemini/antigravity/scratch/student-management-app/index.html"
])

time.sleep(3)

try:
    with urllib.request.urlopen("http://127.0.0.1:9223/json") as resp:
        targets = json.loads(resp.read().decode('utf-8'))
        file_targets = [t for t in targets if 'index.html' in t.get('url', '')]
        print("Matching file target:", file_targets)
        
        page_target = file_targets[0]
        ws_url = page_target['webSocketDebuggerUrl']
        
        path = ws_url.replace("ws://127.0.0.1:9223", "")
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("127.0.0.1", 9223))
        
        key = base64.b64encode(os.urandom(16)).decode('ascii')
        req = (f"GET {path} HTTP/1.1\r\nHost: 127.0.0.1:9223\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n")
        s.sendall(req.encode('utf-8'))
        s.recv(4096)

        def send_ws(msg):
            payload = msg.encode('utf-8')
            length = len(payload)
            header = bytearray([0x81, 0x80 | (length if length <= 125 else 126)])
            if length > 125:
                header.extend(length.to_bytes(2, 'big'))
            mask = os.urandom(4)
            header.extend(mask)
            header.extend(payload[i] ^ mask[i % 4] for i in range(length))
            s.sendall(header)

        # Check console log / exception details
        send_ws(json.dumps({
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {"expression": "document.body.innerText"}
        }))

        res = s.recv(65536).decode('utf-8', errors='ignore')
        print("\n=== RENDERED TEXT ON FILE PROTOCOL ===")
        print(res)

except Exception as e:
    print("File Protocol Test Error:", e)
finally:
    edge_proc.terminate()
