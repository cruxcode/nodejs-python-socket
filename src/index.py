#!/usr/bin/python3
import socket
import os

tempFilename = os.environ["ATRI_APP_TEMPFILENAME"]

s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
s.connect(tempFilename)
s.send(b'Hello, world....')
s.close()
