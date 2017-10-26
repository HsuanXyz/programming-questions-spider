import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import upsertSegmentFault from "../db/segmentfault";

export class getQuestionsUrlOptions {
    page: number;
    sort?: string;
    pageSize?: number;
}

export default class SegmentFaultCrawler {

    url: string = 'https://segmentfault.com/t/';
    QUESTIONS_LINK_SELECTOR = '#qa > section';
    tagged: string = '';
    index: number = 0;
    page;
    browser;
    retry = 0;

    constructor(tagged: string) {
        this.tagged = tagged;
    }

    async run(start, end) {
        this.index = start;
        this.browser = await puppeteer.launch({
            // args: ['--proxy-server=socks5://127.0.0.1:1080']
        });
        this.page = await this.browser.newPage();

        while (this.index < end) {
            let _start = Date.now();
            const url = this.getQuestionsUrl({page: this.index});
            await this.page.goto(url);
            const questions = await this.page.$$eval(this.QUESTIONS_LINK_SELECTOR, (els: any) => [...els].map(e => e.innerHTML));
            const results = questions.map(e => this.parse(e)).filter(e => e.id);
            if (results.length > 0) {
                this.saveQuestions(results);
            }
            console.log(`${this.tagged}: ${this.index} \t ${results.length} \t ${(Date.now() - _start)/1000}s`);
            this.index++;

        }

        await this.browser.close();
        return 'done';
    }

    async close() {
        if (this.browser) {
            await this.browser.close()
        }
    }

    saveQuestions(questions) {
        questions.forEach(q => upsertSegmentFault(q));
    }

    parse(innerHTML: string) {
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

        return { id,title, tags, votes, answer, inputTime, views, marks, source: 'segmentfault' }
    }

    /**
     * 获取问题列表 URL
     * @param {getQuestionsUrlOptions} options
     * @returns {string}
     */
    getQuestionsUrl(options: getQuestionsUrlOptions): string {
        const { page } = options;
        return `${this.url}${this.tagged}?page=${page}&type=votes`
    }

    /**
     * 通过问题 URL 获取问题 ID
     * @param {string} questionUrl
     * @returns {string}
     */
    getQuestionIdByUrl(questionUrl: string): string {
        const regex = /\/q\/(\d+)/gi;
        const result = regex.exec(questionUrl);
        if (result && result[1]) {
            return result[1].trim();
        } else {
            return ''
        }
    }

}

new SegmentFaultCrawler('javascript').run(450, 1000);

new SegmentFaultCrawler('php').run(1, 1000);
new SegmentFaultCrawler('python').run(1, 450);

