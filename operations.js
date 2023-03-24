const fs = require("node:fs/promises");
// Function for handling file creation.
const createFile = async (path) => {
  try {
    // Checking whether we already have that file or not.
    const isFileExisting = await fs.open(path, "r");
    isFileExisting.close();
    return console.log(`The file ${path} already exists. \n`);
  } catch (err) {
    const newFileHandle = await fs.open(path, "w");
    console.log(`Creating file ${path} was successful... \n`);
    newFileHandle.close();
  }
};

// Function for handling file deletion
const deleteFile = async (path) => {
  try {
    await fs.unlink(path);
    console.log(`File ${path} was deleted... \n`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`Error: File ${path} does not exist... \n`);
    }
  }
};

// Function for renaming a file
const renameFile = async (oldPath, newPath) => {
  try {
    await fs.rename(oldPath, newPath);
    console.log(`Renaming ${oldPath} to ${newPath} \n`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`Error: File ${oldPath} does not exist... \n`);
    }
  }
};

// Function for adding content to a file
const addToFile = async (path, content) => {
  try {
    await fs.appendFile(path, `${content}\n`);
    console.log(`Content was added to file ${path} \n`);
  } catch (err) {
    console.log(err.message + "\n");
  }
};

const helpGuide = async () => {
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
  `);
  return 0;
};

module.exports = { createFile, deleteFile, renameFile, addToFile, helpGuide };
