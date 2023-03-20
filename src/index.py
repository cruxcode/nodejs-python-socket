#!/usr/bin/env python
import win32file
import win32pipe
import os

print("running")
# pipename should be of the form \\.\pipe\mypipename

handle = win32file.CreateFile(os.environ["PIPE_NAME"], win32file.GENERIC_READ | win32file.GENERIC_WRITE,
                              0, None, win32file.OPEN_EXISTING, win32file.FILE_ATTRIBUTE_NORMAL, None)

win32file.WriteFile(handle, b'shyam')
