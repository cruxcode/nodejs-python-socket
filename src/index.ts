import net from "net";
import path from "path";
import crypto from "crypto";
import os from "os";
import { exec } from "child_process";

function generateTempFilename(
	prefix?: string,
	suffix?: string,
	tmpdir?: string
) {
	prefix = typeof prefix !== "undefined" ? prefix : "tmp.";
	suffix = typeof suffix !== "undefined" ? suffix : "";
	tmpdir = tmpdir ? tmpdir : os.tmpdir();
	return path.join(
		tmpdir,
		prefix + crypto.randomBytes(16).toString("hex") + suffix
	);
}

const server = net.createServer(function (stream) {
	stream.on("data", function (c) {
		console.log("data:", c.toString());
	});
	stream.on("end", function () {
		server.close();
	});
});

const tempFile = generateTempFilename("atri-app");
server.listen(tempFile);

exec(
	"./src/index.py",
	{ env: { ...process.env, ATRI_APP_TEMPFILENAME: tempFile } },
	(err, stdout, stderr) => {
		if (err) {
			console.log(err);
		}
	}
);
