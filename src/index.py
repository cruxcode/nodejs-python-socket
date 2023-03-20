#!/usr/bin/env python
import win32file
import win32pipe
import os

print("running")
# pipename should be of the form \\.\pipe\mypipename
pipe = win32pipe.CreateNamedPipe(
    os.environ["PIPE_NAME"],
    win32pipe.PIPE_ACCESS_OUTBOUND,
    win32pipe.PIPE_TYPE_MESSAGE | win32pipe.PIPE_WAIT,
    1, 65536, 65536,
    300,
    None)
try:
    win32pipe.ConnectNamedPipe(pipe, None)
    print("Connected named pipe")
    some_data = b'shyam-swaroop'
    win32file.WriteFile(pipe, some_data)
    win32file.FlushFileBuffers(pipe)
finally:
    win32file.CloseHandle(pipe)
