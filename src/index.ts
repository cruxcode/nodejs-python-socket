import net from "net";
import crypto from "crypto";
import { exec } from "child_process";

const PIPE_NAME = "\\\\.\\pipe\\atri" + crypto.randomBytes(4).toString("hex")
console.log(PIPE_NAME)

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

let client: net.Socket;

process.on("SIGTERM", ()=>{
	console.log("term")
controller.abort()
if(client)
client.destroy()
})

process.on("SIGINT", ()=>{
	controller.abort()
	if(client)
	client.destroy()
})

process.on("SIGABRT", ()=>{
	controller.abort();
})

process.on("SIGKILL", ()=>{
	controller.abort()
})

function connect(){
	return new Promise<void>((res, rej)=>{
		client = net.connect(PIPE_NAME, function() {
			console.log('Client: on connection');
		})
		
		client.on('data', function(data) {
			console.log('Client: on data:', data.toString());
		});
		
		client.on('end', function() {
			console.log('Client: on end');
			res()
		})
		
		client.on("close", (hadError)=>{
			console.log("hadError", hadError)
		})
		
		client.on("error", (err)=>{
			rej(err)
		})
	})
}

async function main() {
	connect().then(()=>{}).catch((err)=>{
		if(err.code === "ENOENT"){
			main()
		}
	})
}

main()


