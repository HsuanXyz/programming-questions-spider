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
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const qiita_1 = require("../db/qiita");
class getQuestionsUrlOptions {
}
exports.getQuestionsUrlOptions = getQuestionsUrlOptions;
const log = {
    _log: {},
    addLog(name, log) {
        this._log[name] = `${name}: ${log}`;
    },
    print() {
        const keys = Object.keys(this._log);
        if (keys.length === 0)
            return;
        let logs = '';
        keys.forEach(e => logs += `${this._log[e]} | `);
        console.log(logs);
    }
};
class QiItaCrawler {
    constructor(tagged) {
        this.url = 'https://qiita.com/tags/';
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
            this.browser = yield puppeteer.launch({
                args: ['--proxy-server=socks5://127.0.0.1:1080']
            });
            this.page = yield this.browser.newPage();
            while ((this.index < this.pageMax) || this.pageMax === 0) {
                let _start = Date.now();
                const url = this.getQuestionsUrl({ page: this.index });
                yield this.page.goto(url);
                if (this.pageMax === 0) {
                    this.pageMax = yield this.page.$$eval('.pagination > li > a', (els) => {
                        const href = els[els.length - 1].href;
                        const max = href.substring(href.lastIndexOf('=') + 1);
                        return Number.parseInt(max);
                    });
                }
                const questions = yield this.page.$$eval(this.QUESTIONS_LINK_SELECTOR, (els) => [...els].map(e => e.innerHTML));
                const results = questions.map(e => this.parse(e)).filter(e => e.id);
                this.saveQuestions(results);
                log.addLog(this.tagged, `${this.index}/${this.pageMax} \t ${results.length} \t ${((Date.now() - _start) / 1000).toFixed(3)}s`);
                log.print();
                this.index++;
            }
            yield this.browser.close();
            return 'done';
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
            }
        });
    }
    saveQuestions(questions) {
        questions.forEach(q => qiita_1.default(q));
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
// new QiItaCrawler('Ruby').run(125);
// new QiItaCrawler('Python').run(26);
// new QiItaCrawler('PHP').run(26);
// new QiItaCrawler('機械学習').run(42);
// new QiItaCrawler('自然言語処理').run(27);
// new QiItaCrawler('C%23').run(140);
// new QiItaCrawler('React').run(44);
// new QiItaCrawler('C++').run(58);
// new QiItaCrawler('C').run(60);
// new QiItaCrawler('Linux').run(56);
// new QiItaCrawler('Go').run(36);
// new QiItaCrawler('Git').run(1);
// new QiItaCrawler('Windows').run(1);
// new QiItaCrawler('R').run(1);
//# sourceMappingURL=qiita.js.map