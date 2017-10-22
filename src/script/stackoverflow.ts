import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import upsertStackOverflow from "../db/stackoverflow";

export class getQuestionsUrlOptions {
    page: number;
    sort?: string;
    pageSize?: number;
}

export default class StackOverflowCrawler {

    url: string = 'https://stackoverflow.com/search?q=';
    QUESTIONS_LINK_SELECTOR = '#mainbar .question-summary.search-result';
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
            args: ['--proxy-server=socks5://127.0.0.1:1080']
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
                this.index++;
                this.retry = 0;
            } else if (this.retry < 5) {
                this.retry++
            } else {
                this.index++;
                this.retry = 0;
            }
            await this.page.click('body',{ delay:2020 - (Date.now() - _start) });
            console.log(`第 ${this.index - 1} 页 \t ${results.length}条 \t ${((Date.now() - _start)/1000).toFixed(3)}s \t 重试 ${this.retry}`)

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
        questions.forEach(q => upsertStackOverflow(q));
    }

    parse(innerHTML: string) {
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

        return {id, link, title, excerpt, votes, answer, time, userName, userLink, tags, source: 'stackoverflow'}
    }

    /**
     * 获取问题列表 URL
     * @param {getQuestionsUrlOptions} options
     * @returns {string}
     */
    getQuestionsUrl(options: getQuestionsUrlOptions): string {
        const {page, sort = 'votes', pageSize = 50} = options;
        return `${this.url}${this.tagged}&page=${page}&pagesize=${pageSize}`
    }

    /**
     * 通过问题 URL 获取问题 ID
     * @param {string} questionUrl
     * @returns {string}
     */
    getQuestionIdByUrl(questionUrl: string): string {
        const regex = /\/questions\/(\d+)\//gi;
        const result = regex.exec(questionUrl);
        if (result && result[1]) {
            return result[1].trim();
        } else {
            return ''
        }
    }
}

