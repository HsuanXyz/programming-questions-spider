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
const stackoverflow_1 = require("../db/stackoverflow");
class getQuestionsUrlOptions {
}
exports.getQuestionsUrlOptions = getQuestionsUrlOptions;
class StackOverflowCrawler {
    constructor(tagged) {
        this.url = 'https://stackoverflow.com/search?q=';
        this.QUESTIONS_LINK_SELECTOR = '#mainbar .question-summary.search-result';
        this.tagged = '';
        this.index = 0;
        this.retry = 0;
        this.tagged = tagged;
    }
    run(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            this.index = start;
            this.browser = yield puppeteer.launch({
                args: ['--proxy-server=socks5://127.0.0.1:1080']
            });
            this.page = yield this.browser.newPage();
            while (this.index < end) {
                let _start = Date.now();
                const url = this.getQuestionsUrl({ page: this.index });
                yield this.page.goto(url);
                const questions = yield this.page.$$eval(this.QUESTIONS_LINK_SELECTOR, (els) => [...els].map(e => e.innerHTML));
                const results = questions.map(e => this.parse(e)).filter(e => e.id);
                if (results.length > 0) {
                    this.saveQuestions(results);
                    this.index++;
                    this.retry = 0;
                }
                else if (this.retry < 5) {
                    this.retry++;
                }
                else {
                    this.index++;
                    this.retry = 0;
                }
                yield this.page.click('body', { delay: 2020 - (Date.now() - _start) });
                console.log(`第 ${this.index - 1} 页 \t ${results.length}条 \t ${((Date.now() - _start) / 1000).toFixed(3)}s \t 重试 ${this.retry}`);
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
        questions.forEach(q => stackoverflow_1.default(q));
    }
    parse(innerHTML) {
        const $ = cheerio.load(innerHTML);
        const questionLink = $('div.summary > div.result-link > span > a');
        const user = $('div.summary > div.started.fr > a');
        const tagsEl = $('a.post-tag');
        const tags = tagsEl.map((i, el) => $(el).text()).get().join(',');
        const link = questionLink.attr('href');
        const id = this.getQuestionIdByUrl(link);
        const title = questionLink.attr('title');
        const excerpt = $('div.summary > div.excerpt').text();
        const votes = $('div.statscontainer > div.stats > div.vote > div > span > strong').text();
        const answer = $('div.statscontainer > div.stats > div.status.answered-accepted > strong').text();
        const time = $('div.summary > div.started.fr > span').attr('title');
        const userName = user.text();
        const userLink = user.attr('href');
        return { id, link, title, excerpt, votes, answer, time, userName, userLink, tags, source: 'stackoverflow' };
    }
    /**
     * 获取问题列表 URL
     * @param {getQuestionsUrlOptions} options
     * @returns {string}
     */
    getQuestionsUrl(options) {
        const { page, sort = 'votes', pageSize = 50 } = options;
        return `${this.url}${this.tagged}&page=${page}&pagesize=${pageSize}`;
    }
    /**
     * 通过问题 URL 获取问题 ID
     * @param {string} questionUrl
     * @returns {string}
     */
    getQuestionIdByUrl(questionUrl) {
        const regex = /\/questions\/(\d+)\//gi;
        const result = regex.exec(questionUrl);
        if (result && result[1]) {
            return result[1].trim();
        }
        else {
            return '';
        }
    }
}
exports.default = StackOverflowCrawler;
//# sourceMappingURL=stackoverflow.js.map