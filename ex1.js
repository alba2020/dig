#!/usr/bin/env node
"use strict"

var util = require("util")
var path = require("path")
var fs = require("fs")
var minimist = require("minimist")
var sleep = require("thread-sleep")
var getStdin = require("get-stdin")

var args = minimist(process.argv.slice(2), {
    boolean: ["help", "in"],
    string: ["file"]
})

var BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname)

if (process.env.HELLO) {
    console.log(process.env.HELLO)
}

if (args.help) {
    printHelp()
} else if (args.in || args._.includes("-")) {
    getStdin().then(processFile).catch(error)
} else if (args.file) {
    fs.readFile(path.join(BASE_PATH, args.file), function onContents(err, contents) {
        if (err) {
            error(err.toString())
        } else {
            processFile(contents.toString())
        }
    })
} else {
    error("Incorrect usage.", true)
}

// sleep(100)

function processFile(contents) {
    contents = contents.toUpperCase()
    process.stdout.write(contents)
}

function error(msg, includeHelp = false) {
    console.error(msg)
    if (includeHelp) {
        printHelp()
    }
}

function printHelp() {
    console.log("ex1 usage:")
    console.log("ex1.js --help")
    console.log("--help            print this help")
    console.log("--file={FILENAME} process the file")
    console.log("--in, -           process stdin")
}
