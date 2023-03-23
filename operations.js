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
    if(err.code === "ENOENT"){
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
    if(err.code === "ENOENT"){
      console.log(`Error: File ${oldPath} does not exist... \n`);
    }
  }
};

// Function for adding content to a file
const addToFile = async (path, content) => {
  try {
    await fs.appendFile(path, `${content}\n`);
    console.log(`Content was added to file ${path} \n`)
  } catch(err){
    console.log(err.message + '\n')
  }
};

module.exports = { createFile, deleteFile, renameFile, addToFile };
