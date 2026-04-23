#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys

# 设置端口
PORT = 8000

# 检查是否在正确的目录
if not os.path.exists('index.html'):
    print('错误: 请在dist目录中运行此脚本')
    sys.exit(1)

# 更改当前目录到脚本所在目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 创建HTTP服务器
Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"服务器已启动，地址: http://localhost:{PORT}")
print("按 Ctrl+C 停止服务器")

# 自动打开浏览器
webbrowser.open(f'http://localhost:{PORT}')

# 启动服务器
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\n服务器已停止")
    httpd.shutdown()
