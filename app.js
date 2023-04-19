const fs = require("node:fs/promises");
const path = require("node:path");
const {
  addToFile,
  renameFile,
  deleteFile,
  createFile,
  helpGuide,
} = require("./operations");

(async function () {
  try {
    // commands
    const CREATE_FILE = "mkfile";
    const DELETE_FILE = "delfile";
    const RENAME_FILE = "renfile";
    const ADD_TO_FILE = "appendfile";
    const HELP = "--help";

    // Specifying the name of the file path.
    let commandFilePath = "./command.txt";

    const commandFileHandler = await fs.open(commandFilePath, "r");

    // A command for watching changes in the command.txt file
    const watcher = fs.watch(commandFilePath);

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

      const command = buffer.toString("utf8");

      // Create a file:
      // mkfile <path>
      if (command.includes(CREATE_FILE)) {
        const filePath = path.resolve(
          command.substring(CREATE_FILE.length + 1)
        );
        createFile(filePath);
      }

      // Delete a file
      // delfile <path>
      else if (command.includes(DELETE_FILE)) {
        const filePath = path.resolve(
          command.substring(DELETE_FILE.length + 1)
        );

        deleteFile(filePath);
      }

      // rename a file
      // renfile <path> to <new-path>
      else if (command.includes(RENAME_FILE)) {
        const _idx = command.indexOf(" to ");
        const oldFilePath = path.resolve(
          command.substring(RENAME_FILE.length + 1, _idx)
        );
        const newFilePath = path.resolve(command.substring(_idx + 4));

        renameFile(oldFilePath, newFilePath);
      }

      // Requesting help
      // --help
      else if (command.includes(HELP)) {
        helpGuide();
      }

      // Add to file
      // appendfile <path> this content: <content>
      else if (command.includes(ADD_TO_FILE)) {
        const _idx = command.indexOf(" this content: ");
        const filePath = path.resolve(
          command.substring(ADD_TO_FILE.length + 1, _idx)
        );
        const content = command.substring(_idx + 15);

        addToFile(filePath, content);
      }

      // Command to handle invalid commands
      else {
        console.log("\n" + "Invalid command: " + command);
        console.log("For help: enter command --help");
      }
    });

    for await (const event of watcher) {
      if (event.eventType === "change") {
        commandFileHandler.emit("change");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
})();
