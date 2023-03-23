const fs = require("node:fs/promises");
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

module.exports = { createFile, deleteFile, renameFile, addToFile };
