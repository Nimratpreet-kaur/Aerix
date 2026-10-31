import http.server
import functools
import os
import sys

PORTS = [8080, 8888, 5173, 5000, 9000, 3001, 8000]
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIRECTORY)

def start_server():
    for port in PORTS:
        try:
            httpd = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
            print(f"StampTrust server successfully listening at http://127.0.0.1:{port}", flush=True)
            return httpd, port
        except (PermissionError, OSError):
            continue
    print("Could not bind to any standard port. You can open index.html directly in a browser.", flush=True)
    sys.exit(1)

if __name__ == '__main__':
    httpd, port = start_server()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)
