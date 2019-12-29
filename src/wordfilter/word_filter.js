const fs = require("fs");
const path = require('path');
const readline = require('readline');

module.exports = class WordFilter {
    constructor() {
        this.config = require('../config.js');
        this.sensitiveMap = {};
        this.createMap();
    }

    async createMap() {
        var words = [];
        let filePromise = new Promise((resolve, reject) => {
            let input = fs.createReadStream(path.join(__dirname, this.config.sensitiveWordsPath))
            const rl = readline.createInterface({
                input: input
            });
            rl.on('line', (line) => { words.push(line); });
            rl.on('close', (line) => { resolve(words); });
        })
        words = await filePromise;

        var result = {};
        var count =  words.length;
        for (var i = 0; i < count; ++i) {
            var map = result;
            var word = words[i];
            for (var j = 0; j < word.length; ++j) {
                var c = word.charAt(j);
                if (typeof(map[c]) != "undefined") {
                    map = map[c];
                    if (map["empty"]) {
                       break;
                    }
                } else {
                    if (map["empty"]) { 
                      delete map["empty"]; 
                    }
                    map[c] = {"empty":true};
                    map = map[c];
                }
            }
        }
        this.sensitiveMap = result;
    }

    replaceAt(string, index, replace) {
      if (index == 0) {
        return replace + string.substring(index + 1);
      }
      return string.substring(0, index) + replace + string.substring(index + 1);
    }

    filter(content) {
        var map = this.sensitiveMap;
        var count = content.length;
        var stack = [];
        var point = map;
        var sensitivesPos = -1;
        var sensitiveIndex = [];
        for (var i = 0; i < count; ++i) {
            var c = content.charAt(i);
            var item = point[c];
            if (typeof(item) == "undefined") {
                i = i - stack.length;
                stack = [];
                point = map;
                sensitivesPos = i;
            } else if (item["empty"]) {
                stack.push(c);
                stack = [];
                point = map;
                let flag = 0
                if (sensitivesPos != 0) flag = sensitivesPos + 1;
                for (; flag <= i; ++flag) {
                  sensitiveIndex.push(flag);
                }
                sensitivesPos = -1;
            } else {
                stack.push(c);
                point = item;
                if (i == 0) {
                    sensitivesPos = i;
                }
            }
        }
        for (var i = 0; i < sensitiveIndex.length; ++i) {
            content = this.replaceAt(content, sensitiveIndex[i], "*")
        }
        return content;
    }
}