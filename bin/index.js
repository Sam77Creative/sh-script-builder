#!/usr/bin/env node

// Import the main function
const main = require("../lib");

// Get the cli arguments
const inputString = process.argv[2];
const outputString = process.argv[3];

// Run it
main.default(inputString, outputString);
