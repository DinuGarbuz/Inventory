const log = function (message: string | Error) {
	if (message instanceof Error)
		eval(`console.error("${String(message)}")`);
	else
		eval(`console.log("${message}")`);
}

export { log }