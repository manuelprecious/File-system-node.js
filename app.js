const fs = require("node:fs/promises");
const path = require("node:path");
const {
  addToFile,
  renameFile,
  deleteFile,
  createFile,
} = require("./operations");

(async function () {
  try {
    // commands
    const CREATE_FILE = "create file";
    const DELETE_FILE = "delete file";
    const RENAME_FILE = "rename file";
    const ADD_TO_FILE = "add to file";
    const HELP = '--help';

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

      const command = buffer.toString("utf8");

      // Create a file:
      // create file <path>
      if (command.includes(CREATE_FILE)) {
        const filePath = path.resolve(
          command.substring(CREATE_FILE.length + 1)
        );
        createFile(filePath);
      }

      // Delete a file
      // delete file <path>
      else if (command.includes(DELETE_FILE)) {
        const filePath = path.resolve(
          command.substring(DELETE_FILE.length + 1)
        );

        deleteFile(filePath);
      }

      // rename a file
      // rename file <path> to <new-path>
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
        console.log(`
        COMMANDS
        
        1. --help:                                          Displays the help menu.
        
        2. rename file <path> to <new-path>:-               Give a new name to a file
                                                            (renaming a file.)

        3. delete file <path>:-                             remove an existing file.
                                                            If a file does not exist, an 
                                                            error will be shown

        4. create file <path>:-                             create a new file.
                                                            If the file name already exists,
                                                            an error will be thrown.
                                            
        5. add to file <path> this content: <content>:      Add content specified in the
                                                            content flag to the specified
                                                            file path.

        NOTE: For command 5, if the specified file does not exist, a new one will be created.                                                    
        `)
      }

      // Add to file
      // add to file <path> this content: <content>
      else if (command.includes(ADD_TO_FILE)) {
        const _idx = command.indexOf(" this content: ");
        const filePath = path.resolve(
          command.substring(ADD_TO_FILE.length + 1, _idx)
        );

        const content = command.substring(_idx + 15);

        addToFile(filePath, content);
      } else {
        console.log("\n" + "Invalid command: " + command);
        console.log("For help: enter command --help");
      }
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
