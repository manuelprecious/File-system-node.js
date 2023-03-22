const fs = require("node:fs/promises");

(async function () {
  try {
    let commandFilePath = "./command.txt";
    const commandFileHandler = await fs.open(commandFilePath, "r");

    commandFileHandler.on("change", async () => {
      // We want to read the content of the file.
      // First we define the size of the buffer to store.
      const bufferSize = (await commandFileHandler.stat()).size;

      // Then defining parameters for reading the file
      let buffer = Buffer.alloc(bufferSize);
      let offset = 0;
      let position = 0;
      let contentLength = buffer.byteLength;

      // Reading all the content of the file into memory
      await commandFileHandler.read(buffer, offset, contentLength, position);
      console.log(buffer.toString('utf8'));
    });

    // A command for watching changes in the command.txt file
    const watcher = fs.watch(commandFilePath);

    for await (const event of watcher) {
      if (event.eventType === "change") {
        commandFileHandler.emit("change");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
})();
