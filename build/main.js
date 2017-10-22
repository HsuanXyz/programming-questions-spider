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
                q: '[jquery] "jquery" score:3 views:1000 is:question',
                max: 840
            },
            "angular": {
                q: '[angular] score:1  is:question',
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
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const crawler = new stackoverflow_1.default(tags['android'].q);
        yield crawler.run(1, tags['android'].max);
        console.log('done');
    });
}
main();
//# sourceMappingURL=main.js.map