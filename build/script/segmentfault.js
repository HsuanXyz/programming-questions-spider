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
const segmentfault_1 = require("../db/segmentfault");
class getQuestionsUrlOptions {
}
exports.getQuestionsUrlOptions = getQuestionsUrlOptions;
class SegmentFaultCrawler {
    constructor(tagged) {
        this.url = 'https://segmentfault.com/t/';
        this.QUESTIONS_LINK_SELECTOR = '#qa > section';
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
                }
                console.log(`${this.index} \t ${results.length} \t ${(Date.now() - _start) / 1000}s`);
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
        questions.forEach(q => segmentfault_1.default(q));
    }
    parse(innerHTML) {
        const $ = cheerio.load(innerHTML);
        const questionLink = $('div.summary > h2 > a');
        const link = questionLink.attr('href');
        const id = this.getQuestionIdByUrl(link);
        const title = questionLink.text();
        const tagsEl = $('div.summary > ul.taglist--inline .tagPopup');
        let marks = Number.parseInt($('div.summary > ul.author.list-inline > li.pull-right').text());
        marks = Number.isNaN(marks) ? 0 : marks;
        const tags = tagsEl.map((i, el) => $(el).text()).get().join(',');
        const votes = Number.parseInt($('div.votes.plus.hidden-xs').text());
        const answer = Number.parseInt($('div.answers.answered').text());
        const inputTime = Date.now();
        const views = $('div.views.hidden-xs > span').text();
        return { id, title, tags, votes, answer, inputTime, views, marks, source: 'segmentfault' };
    }
    /**
     * 获取问题列表 URL
     * @param {getQuestionsUrlOptions} options
     * @returns {string}
     */
    getQuestionsUrl(options) {
        const { page } = options;
        return `${this.url}${this.tagged}?page=${page}&type=votes`;
    }
    /**
     * 通过问题 URL 获取问题 ID
     * @param {string} questionUrl
     * @returns {string}
     */
    getQuestionIdByUrl(questionUrl) {
        const regex = /\/q\/(\d+)/gi;
        const result = regex.exec(questionUrl);
        if (result && result[1]) {
            return result[1].trim();
        }
        else {
            return '';
        }
    }
}
exports.default = SegmentFaultCrawler;
new SegmentFaultCrawler('javascript').run(450, 1000);
//# sourceMappingURL=segmentfault.js.map