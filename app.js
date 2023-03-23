const fs = require("node:fs/promises");
const path = require("node:path");

(async function () {
  try {
    // commands
    const CREATE_FILE = "create a file";
    const DELETE_FILE = "delete the file";
    const RENAME_FILE = "rename the file";
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
      const deleteFile = async (path) => {
        console.log(`Deleting ${path}...`);
      };

      // Function for renaming a file
      const renameFile = async (oldPath, newPath) => {
        console.log(`Renaming ${oldPath} to ${newPath}`);
      };

      // Function for adding content to a file
      const addToFile = async (path, content) => {
        console.log(`Adding to ${path}`);
        console.log(`Content: ${content}`);
      };

      // Create a file:
      // Create a file <path>
      if (command.includes(CREATE_FILE)) {
        const filePath = path.resolve(
          command.substring(CREATE_FILE.length + 1)
        );
        createFile(filePath);
      }

      // Delete a file
      // delete the file <path>
      if (command.includes(DELETE_FILE)) {
        const filePath = path.resolve(
          command.substring(DELETE_FILE.length + 1)
        );

        deleteFile(filePath);
      }

      // rename a file
      // rename the file <path> to <new-path>
      if (command.includes(RENAME_FILE)) {
        const _idx = command.indexOf(" of ");
        const oldFilePath = path.resolve(
          command.substring(RENAME_FILE.length + 1, _idx)
        );
        const newFilePath = path.resolve(command.substring(_idx + 4));

        renameFile(oldFilePath, newFilePath);
      }

      // Add to file
      // add to the file <path> this content: <content>
      if (command.includes(ADD_TO_FILE)) {
        const _idx = command.indexOf(" this content: ");
        const filePath = path.resolve(
          command.substring(ADD_TO_FILE.length + 1, _idx)
        );

        const content = command.substring(_idx + 15);

        addToFile(filePath, content);
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
