#!/usr/bin/env node
"use strict"

var util = require("util")
var path = require("path")
var fs = require("fs")
var minimist = require("minimist")
// var sleep = require("thread-sleep")
// var getStdin = require("get-stdin")
var Transform = require("stream").Transform

var args = minimist(process.argv.slice(2), {
    boolean: ["help", "in", "out"],
    string: ["file"]
})

var BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname)
var OUTFILE = path.join(BASE_PATH, "out.txt")

if (process.env.HELLO) {
    console.log(process.env.HELLO)
}

if (args.help) {
    printHelp()
} else if (args.in || args._.includes("-")) {
    // getStdin().then(processFile).catch(error)
    processFile(process.stdin)
} else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file))
    processFile(stream)
} else {
    error("Incorrect usage.", true)
}

// sleep(100)

function processFile(inStream) {
    var outStream = inStream

    var upperStream = new Transform({
        transform(chunk, enc, cb) {
            this.push(chunk.toString().toUpperCase())
            cb()
            // setTimeout(cb, 500)
        }
    })

    outStream = outStream.pipe(upperStream)

    var targetStream
    if (args.out) {
        targetStream = process.stdout
    } else {
        targetStream = fs.createWriteStream(OUTFILE)
    }
    outStream.pipe(targetStream)
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
    console.log("--out             print to stdout")
}
