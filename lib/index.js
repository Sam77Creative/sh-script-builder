"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var archiver = require("archiver");
var eol = require("eol");
var fs = require("fs");
var path = require("path");
function main(inputDir, outputDir) {
    return __awaiter(this, void 0, void 0, function () {
        var index, modules, indexArray, builtIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        inputDir = path.resolve(inputDir);
                    }
                    catch (e) {
                        logStr("There is an issue with your input directory");
                        console.log(e);
                        return [2];
                    }
                    logStr("Starting build");
                    logStr("Using " + inputDir + " as input");
                    index = readFile(path.resolve(inputDir, "index.sh"));
                    modules = getAllModules(path.resolve(inputDir, "modules"));
                    logStr("Loaded " + modules.length + " module(s)");
                    indexArray = index.split("\n");
                    modules.forEach(function (m) {
                        var file = readFile(path.resolve(inputDir, "modules", m));
                        indexArray.splice(1, 0, file);
                    });
                    builtIndex = indexArray.join("\n");
                    builtIndex = eol.lf(builtIndex);
                    logStr("Built index.sh");
                    return [4, createTarball(inputDir, outputDir, builtIndex)];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.default = main;
function createTarball(inputDir, outputFile, index) {
    return new Promise(function (resolve, reject) {
        var output = fs.createWriteStream(path.resolve(inputDir, outputFile));
        var archive = archiver("tar", {
            gzip: true
        });
        output.on("close", function () {
            logStr("Tar created");
            resolve();
        });
        archive.pipe(output);
        archive.append(index, { name: "index.sh" });
        archive.directory(path.resolve(inputDir, "assets"), "assets");
        archive.finalize();
    });
}
function getAllModules(inputDir) {
    return fs.readdirSync(inputDir).filter(function (s) { return s.includes(".sh"); });
}
function readFile(filePath) {
    var buff = fs.readFileSync(filePath);
    return buff.toString();
}
function logStr(string) {
    console.log("sh-builder: " + string);
}
