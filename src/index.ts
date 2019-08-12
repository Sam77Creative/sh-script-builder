import * as archiver from "archiver";
import * as eol from "eol";
import * as fs from "fs";
import * as path from "path";

export default async function main(inputDir: string, outputDir: string) {
  // Validate inputDir and outputDir
  try {
    inputDir = path.resolve(inputDir);
  } catch (e) {
    logStr(`There is an issue with your input directory`);
    console.log(e);
    return;
  }

  // Log start of builder
  logStr("Starting build");
  logStr(`Using ${inputDir} as input`);

  // Get the index file
  const index = readFile(path.resolve(inputDir, "index.sh"));

  // Get a list of modules
  const modules = getAllModules(path.resolve(inputDir, "modules"));
  logStr(`Loaded ${modules.length} module(s)`);

  // Get an array of index file lines
  let indexArray = index.split("\n");

  // Load all module files and insert them at the second line of the index file
  modules.forEach((m: string) => {
    // Load the file
    const file = readFile(path.resolve(inputDir, "modules", m));
    // Slice the file into the indexArray
    indexArray.splice(1, 0, file);
  });

  // Join the indexArray into a new index
  let builtIndex = indexArray.join("\n");

  // Convert to lf line endings
  builtIndex = eol.lf(builtIndex);

  // Log out succesful index build
  logStr(`Built index.sh`);

  // Create tar of project
  await createTarball(inputDir, outputDir, builtIndex);
}

function createTarball(
  inputDir: string,
  outputFile: string,
  index: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(path.resolve(inputDir, outputFile));
    const archive = archiver("tar", {
      gzip: true
    });

    // Setup close event
    output.on("close", () => {
      logStr("Tar created");
      resolve();
    });

    // Pipe archive to output
    archive.pipe(output);

    // Append the index file
    archive.append(index, { name: "index.sh" });

    // Add the assets directory
    archive.directory(path.resolve(inputDir, "assets"), "assets");

    // Finalize the archive
    archive.finalize();
  });
}

function getAllModules(inputDir: string): string[] {
  return fs.readdirSync(inputDir).filter((s: string) => s.includes(".sh"));
}

/**
 * Read in a file as a string
 * @param filePath string
 */
function readFile(filePath: string): string {
  const buff = fs.readFileSync(filePath);
  return buff.toString();
}

function logStr(string: string) {
  console.log(`sh-builder: ${string}`);
}
