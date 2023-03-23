const fs = require("node:fs/promises");
const path = require("node:path");

(async function () {
  try {
    // commands
    const CREATE_FILE = "create a file";
    const DELETE_FILE = "delete a file";
    const REMAME_FILE = "rename a file";
    const ADD_TO_FILE = "add to the file";

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

      // Create a file

      // Function for handling file creation.
      const createFile = async (path) => {
        try {
          // Checking whether we already have that file or not.
          const isFileExisting = await fs.open(path, "r");
          isFileExisting.close();
          return console.log(`The file ${path} already exists.`);
        } catch (err) {
          const newFileHandle = await fs.open(path, "w");
          console.log("A new file was successfully created");
          newFileHandle.close();
        }
      };

      // Function for handling file deletion
      const deleteFile = async (path) => {};

      // Create a file:
      // Create a file <path>
      if (command.includes(CREATE_FILE)) {
        const filePath = path.resolve(
          command.substring(CREATE_FILE.length + 2)
        );
        createFile(filePath);
      }

    //   // Delete a file
    //   // delete the file <path>
    //   if (command.includes(DELETE_FILE)) {
    //     const filePath = path.resolve(
    //       command.substring(DELETE_FILE.length + 2)
    //     );

    //     deleteFile(filePath);
    //   }
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
