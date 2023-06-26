import { readFileSync, statSync, mkdirSync } from "fs";

export const readFile = (reportPath: string) => {
  return readFileSync(reportPath, { encoding: "utf8" });
};

export const convertToJSON = (stringJson: string) => {
  try {
    return JSON.parse(stringJson);
  } catch (error) {
    new Error("Error in parsing the data");
  }
};

export const isDirectoryExists = (path: string) => {
  try {
    return statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
};

export const makeDirectory = (path: string) => {
  try {
    return mkdirSync(path, { recursive: true });
  } catch (error) {
    return `Error in creating the directory ${path}`;
  }
};
