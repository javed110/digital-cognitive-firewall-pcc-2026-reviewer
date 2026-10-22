"""Serve only the prototype's static allowlisted files on loopback."""
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import mimetypes
ROOT = Path(__file__).resolve().parent / 'app'
FILES = {'/': 'index.html', '/index.html': 'index.html', '/style.css': 'style.css',
         '/ui.mjs': 'ui.mjs', '/analyzer.mjs': 'analyzer.mjs', '/samples.mjs': 'samples.mjs'}
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        filename = FILES.get(urlsplit(self.path).path)
        if not filename:
            self.send_error(404); return
        data=(ROOT/filename).read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', 'text/javascript; charset=utf-8' if filename.endswith('.mjs') else (mimetypes.guess_type(filename)[0] or 'application/octet-stream')+'; charset=utf-8')
        self.send_header('Content-Length',str(len(data)))
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Referrer-Policy','no-referrer')
        self.send_header('X-Frame-Options','DENY')
        self.end_headers(); self.wfile.write(data)
if __name__=='__main__':
    import argparse
    p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=8798);a=p.parse_args()
    print(f'Open http://127.0.0.1:{a.port}/ . Ctrl+C stops the server.',flush=True)
    HTTPServer(('127.0.0.1',a.port),Handler).serve_forever()
