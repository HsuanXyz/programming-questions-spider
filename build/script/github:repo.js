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
const cheerio = require("cheerio");
const github_repo_1 = require("../db/github:repo");
const node_fetch_1 = require("node-fetch");
class getQuestionsUrlOptions {
}
exports.getQuestionsUrlOptions = getQuestionsUrlOptions;
const log = {
    _log: {},
    addLog(name, log) {
        this._log[name] = `${name}: ${log}`;
    },
    get log() {
        const keys = Object.keys(this._log);
        if (keys.length === 0)
            return;
        let logs = '';
        keys.forEach(e => logs += `${this._log[e]} | `);
        return logs;
    },
    print() {
        console.log(this.log);
    },
    warn() {
        console.warn(this.log);
    }
};
class QiItaCrawler {
    constructor(tagged) {
        this.url = 'https://api.github.com/search/repositories?q=';
        this.QUESTIONS_LINK_SELECTOR = 'div.tableList > article.ItemLink';
        this.tagged = '';
        this.index = 0;
        this.pageMax = 0;
        this.retry = 0;
        this.tagged = tagged;
    }
    run(start) {
        return __awaiter(this, void 0, void 0, function* () {
            this.index = start;
        });
    }
    json(start) {
        return __awaiter(this, void 0, void 0, function* () {
            this.index = start;
            while ((this.index < this.pageMax) || this.pageMax === 0) {
                const _start = Date.now();
                yield node_fetch_1.default(`${this.url}${this.tagged}&page=${this.index}`)
                    .then(res => res.json())
                    .then(json => {
                    if (!json.incomplete_results && json.items && json.items.length > 0) {
                        this.pageMax = Math.ceil(json.total_count / 100);
                        const { items } = json;
                        this.saveQuestions(items);
                        log.addLog(this.tagged, `${this.index}/${this.pageMax} \t ${items.length}  \t ${((Date.now() - _start) / 1000).toFixed(3)}s`);
                        log.print();
                        this.index++;
                        if (this.index >= this.pageMax) {
                            this.index = -1;
                        }
                    }
                    else {
                        if (json.message) {
                            console.log(json.message);
                        }
                        else {
                            log.addLog(this.tagged, `${this.index}/${this.pageMax} \t ${0}  \t ${((Date.now() - _start) / 1000).toFixed(3)}s \t fail`);
                            log.warn();
                        }
                    }
                }).catch(err => {
                    console.error(err);
                });
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
            }
        });
    }
    saveQuestions(res) {
        res.forEach(e => github_repo_1.default({
            item: e,
            id: e.id,
            name: e.name,
            description: e.description
        }));
    }
    parse(innerHTML) {
        const $ = cheerio.load(innerHTML);
        const questionLink = $('div.ItemLink__title > a');
        const link = questionLink.attr('href');
        const id = this.getQuestionIdByUrl(link);
        const title = questionLink.text();
        const tagsEl = $('ul.TagList > li > a');
        const tags = tagsEl.map((i, el) => $(el).text()).get().join(',');
        let time, user;
        let info = /\d\d\d\d\/\d\d\/\d\d/.exec($('div > div.ItemLink__info').text());
        if (info) {
            time = info[0] ? info[0] : '';
            user = info[0] ? info.input.substring(0, info.index - 1) : '';
        }
        else {
            info = $('div > div.ItemLink__info').text().split(' posted on ');
            time = info[1] ? info[1] : '';
            user = info[0] ? info[0] : '';
        }
        const comment = Number.parseInt($('span.fa-comment-o').next().text() || 0);
        const like = Number.parseInt($('span.fa-like').next().text() || 0);
        return { id, title, time, user, link, tags, comment, like, source: 'qiita' };
    }
    /**
     * 获取问题列表 URL
     * @param {getQuestionsUrlOptions} options
     * @returns {string}
     */
    getQuestionsUrl(options) {
        const { page } = options;
        return `${this.url}${this.tagged}/items/?page=${page}`;
    }
    /**
     * 通过问题 URL 获取问题 ID
     * @param {string} questionUrl
     * @returns {string}
     */
    getQuestionIdByUrl(questionUrl) {
        let _s = questionUrl.split('/');
        return _s[_s.length - 1];
    }
}
exports.default = QiItaCrawler;
new QiItaCrawler('angular&sort=stars&order=desc&per_page=100').run(1);
//# sourceMappingURL=github:repo.js.map