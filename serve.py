import http.server, os, sys

os.chdir("/Users/josmd/Desktop/Landin_Plusval")

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args): pass

http.server.HTTPServer(("", 3456), Handler).serve_forever()
