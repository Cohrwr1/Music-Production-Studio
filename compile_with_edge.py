import subprocess
import time
import urllib.request
import json
import socket
import base64
import os

# Start Edge with remote debugging
edge_proc = subprocess.Popen([
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless",
    "--remote-debugging-port=9222",
    "http://localhost:3000/compiler.html"
])

time.sleep(3)

try:
    with urllib.request.urlopen("http://127.0.0.1:9222/json") as resp:
        targets = json.loads(resp.read().decode('utf-8'))
        print("Edge targets:", [t.get('title') for t in targets])
        page_target = [t for t in targets if 'compiler' in t.get('url', '')][0]
        ws_url = page_target['webSocketDebuggerUrl']
        print("WebSocket URL:", ws_url)
        
        # Connect to WS using raw socket handshake
        # Parse host & path
        path = ws_url.replace("ws://127.0.0.1:9222", "")
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("127.0.0.1", 9222))
        
        # Handshake
        key = base64.b64encode(os.urandom(16)).decode('ascii')
        req = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: 127.0.0.1:9222\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        s.sendall(req.encode('utf-8'))
        
        resp_hdr = s.recv(4096)
        print("Handshake response received.")

        # Send Runtime.evaluate to get innerText of #output
        def send_ws_text(msg):
            payload = msg.encode('utf-8')
            length = len(payload)
            header = bytearray()
            header.append(0x81) # FIN + text frame
            if length <= 125:
                header.append(0x80 | length) # masked
            elif length <= 65535:
                header.append(0x80 | 126)
                header.extend(length.to_bytes(2, 'big'))
            mask_key = os.urandom(4)
            header.extend(mask_key)
            masked_payload = bytearray(payload[i] ^ mask_key[i % 4] for i in range(length))
            s.sendall(header + masked_payload)

        # Evaluate document.getElementById('output').innerText
        eval_cmd = json.dumps({
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "document.getElementById('output').innerText",
                "awaitPromise": True
            }
        })
        send_ws_text(eval_cmd)

        raw_resp = s.recv(1048576)
        print("Raw frame length:", len(raw_resp))

        # Unmask incoming WS frame if needed or extract text
        text_content = raw_resp.decode('utf-8', errors='ignore')
        with open('ws_output.json', 'w', encoding='utf-8') as f_out:
            f_out.write(text_content)
        print("Wrote ws_output.json")
except Exception as e:
    print("Error:", e)
finally:
    edge_proc.terminate()
