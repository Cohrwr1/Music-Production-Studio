import http.server
import socketserver
import webbrowser
import os
import sys
import json
import socket

PORT = 3000
DATA_FILE = "studio_data.json"

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class StudioRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/data':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            if os.path.exists(DATA_FILE):
                try:
                    with open(DATA_FILE, 'r', encoding='utf-8') as f:
                        content = f.read()
                    self.wfile.write(content.encode('utf-8'))
                except Exception as e:
                    self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
            else:
                self.wfile.write(json.dumps({"status": "not_found", "students": [], "attendance": []}).encode('utf-8'))
            return
        elif self.path == '/api/ip':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            ip = get_local_ip()
            self.wfile.write(json.dumps({"ip": ip, "port": PORT, "url": f"http://{ip}:{PORT}"}).encode('utf-8'))
            return
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/data':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Saved centrally"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
            return
        return super().do_POST()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    local_ip = get_local_ip()

    print("==================================================")
    print(" Music Production - Student Management Server")
    print("==================================================")
    print(f" Host PC Access:       http://localhost:{PORT}")
    print(f" Network/Phone Access:  http://{local_ip}:{PORT}")
    print("==================================================")
    print(" [ACTIVE] Central Multi-User Sync Enabled")
    print(" Any change made by owner will sync live to all devices!")
    print("==================================================")
    print(" Press Ctrl+C to stop the server.\n")

    webbrowser.open(f"http://localhost:{PORT}")

    with socketserver.TCPServer(("", PORT), StudioRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)

if __name__ == "__main__":
    main()
