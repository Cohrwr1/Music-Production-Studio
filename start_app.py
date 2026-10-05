import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000

class Handler(http.server.SimpleHTTPRequestHandler):
    pass

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    print(f"==================================================")
    print(f" Graduation Cap - Student Management Application")
    print(f"==================================================")
    print(f" Server running locally at: http://localhost:{PORT}")
    print(f" Press Ctrl+C to stop the server.")
    print(f" Opening web application in browser now...\n")

    webbrowser.open(f"http://localhost:{PORT}")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)

if __name__ == "__main__":
    main()
