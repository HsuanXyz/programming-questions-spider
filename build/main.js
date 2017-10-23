"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stackoverflow_1 = require("./script/stackoverflow");
const tags = {
    'javascript': {
        q: '[javascript] score:3 views:1000 is:question',
        max: 2200,
        children: {
            'jquery': {
                q: '%5Bjquery%5D+"jquery"+score%3A3+views%3A1000+is%3Aquestion',
                max: 840
            },
            "angular": {
                q: '%5Bangular%5D+score%3A1++is%3Aquestion',
                max: 720
            },
            "angularjs": {
                q: '[angularjs] score:3  is:question',
                max: 560
            }
        }
    },
    'c#': {
        q: '%5Bc%23%5D+score%3A3+views%3A1000+is%3Aquestion',
        max: 2200
    },
    'java': {
        q: '%5Bjava%5D+score%3A3+views%3A1000+is%3Aquestion',
        max: 2500
    },
    'python': {
        q: '%5Bpython%5D+score%3A2+views%3A1000+is%3Aquestion',
        max: 2180
    },
    'php': {
        q: '%5Bphp%5D+score%3A2+views%3A1000++is%3Aquestion',
        max: 1900
    },
    'node.js': {
        q: '%5Bnode.js%5D+score%3A2++is%3Aquestion',
        max: 910
    },
    'android': {
        q: '%5Bandroid%5D+score%3A2+views%3A1000++is%3Aquestion',
        max: 2100
    },
    'ios': {
        q: '%5Bios%5D+score%3A3+views%3A200+is%3Aquestion',
        max: 1500
    },
    'mysql': {
        q: '%5Bmysql%5D+score%3A2+views%3A200+is%3Aquestion',
        max: 1170
    },
    'unity3d': {
        q: '%5Bunity3d%5D+is%3Aquestion',
        max: 500
    },
    'ruby-on-rails': {
        q: '%5Bruby-on-rails%5D+score%3A2+views%3A200+is%3Aquestion',
        max: 1100
    },
    'css': {
        q: '%5Bcss%5D+score%3A2+views%3A200+is%3Aquestion',
        max: 1500
    },
    'regex': {
        q: '%5Bregex%5D+score%3A2+views%3A200+is%3Aquestion',
        max: 580
    },
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const crawler = new stackoverflow_1.default(tags['regex'].q);
        yield crawler.run(300, tags['regex'].max);
        console.log('done');
    });
}
main();
//# sourceMappingURL=main.js.map