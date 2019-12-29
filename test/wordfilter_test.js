import test from 'ava';

function WordFilter() {
    let sensitiveMap = [];

    this.createMap = function () {
        var words = ["fuck", "hell"];
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
    },

    this.replaceAt = function(string, index, replace) {
      if (index == 0) {
        return replace + string.substring(index + 1);
      }
      return string.substring(0, index) + replace + string.substring(index + 1);
    }

    this.filter = function (content) {
        var map = this.sensitiveMap;
        var count = content.length;
        var stack = [];
        var point = map;
        var sensitivesPos = -1;
        var sensitiveIndex = [];
        for (var i = 0; i < count; ++i) {
            var c = content.charAt(i);
            var item = point[c];
            if (typeof(point[c]) == "undefined") {
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
test('wordfilter testing', t => {
    let wf = new WordFilter();
    wf.createMap();
    t.is(wf.filter("hellboy"), "****boy");
});