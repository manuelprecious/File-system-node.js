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
    console.log(`Creating file ${path} successful`);
    newFileHandle.close();
  }
};

// Function for handling file deletion
const deleteFile = async (path) => {
  try {
    await fs.unlink(path);
    console.log(`File ${path} deleted...`);
  } catch (err) {
    console.log(`Error: N${err.message.slice(9, 33)}...`);
  }
};

// Function for renaming a file
const renameFile = async (oldPath, newPath) => {
  try {
    await fs.rename(oldPath, newPath);
    console.log(`Renaming ${oldPath} to ${newPath}`);

  } catch (err) {
    console.log(err.message);
  }
};

// Function for adding content to a file
const addToFile = async (path, content) => {
  try {
    await fs.appendFile(path, content);
  } catch(error){

  }
};

module.exports = { createFile, deleteFile, renameFile, addToFile };
