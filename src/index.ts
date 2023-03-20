import net from "net";
import crypto from "crypto";
import { exec } from "child_process";

const PIPE_NAME = "\\\\.\\pipe\\atri" + crypto.randomBytes(4).toString("hex")
console.log(PIPE_NAME)

const server = net.createServer((socket)=>{
	socket.on("data", (data)=>{
		console.log("data:", data.toString())
	})
})

server.on("connection", (socket)=>{
	console.log("socket connected")
})

server.listen(PIPE_NAME, ()=>{
	const controller = new AbortController();
	const { signal } = controller;
	exec(
		"python3 ./src/index.py > b.txt",
		{ env: { ...process.env, PIPE_NAME }, signal },
		(err, stdout, stderr) => {
			console.log("ran")
			if (err) {
				console.log(err);
			}
	
		}
	);

	process.on("SIGTERM", ()=>{
		controller.abort()
	})

	process.on("SIGINT", ()=>{
		controller.abort()
	})

	process.on("SIGABRT", ()=>{
		controller.abort();
	})

	process.on("SIGKILL", ()=>{
		controller.abort()
	})
})
