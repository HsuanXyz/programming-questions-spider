import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import upsertQiiTa from "../db/qiita";

export class getQuestionsUrlOptions {
    page: number;
    sort?: string;
    pageSize?: number;
}

const log = {
    _log: {},
    addLog(name, log) {
        this._log[name] = `${name}: ${log}`;
    },
    print() {
        const keys = Object.keys(this._log);
        if (keys.length === 0) return;
        let logs = '';
        keys.forEach(e => logs+= `${this._log[e]} | `);
        console.log(logs)
    }
};

export default class QiItaCrawler {

    url: string = 'https://qiita.com/tags/';
    QUESTIONS_LINK_SELECTOR = 'div.tableList > article.ItemLink';
    tagged: string = '';
    index: number = 0;
    pageMax = 0;
    page;
    browser;
    retry = 0;

    constructor(tagged: string) {
        this.tagged = tagged;
    }

    async run(start) {
        this.index = start;
        this.browser = await puppeteer.launch({
            args: ['--proxy-server=socks5://127.0.0.1:1080']
        });
        this.page = await this.browser.newPage();

        while ((this.index < this.pageMax) || this.pageMax === 0) {
            let _start = Date.now();
            const url = this.getQuestionsUrl({page: this.index});
            await this.page.goto(url);
           if (this.pageMax === 0) {
               this.pageMax = await this.page.$$eval('.pagination > li > a',(els: any) => {
                   const href = els[els.length - 1].href;
                   const max = href.substring(href.lastIndexOf('=') + 1);
                   return Number.parseInt(max)
               });
           }
            const questions = await this.page.$$eval(this.QUESTIONS_LINK_SELECTOR, (els: any) => [...els].map(e => e.innerHTML));
            const results = questions.map(e => this.parse(e)).filter(e => e.id);
            this.saveQuestions(results);
            log.addLog(this.tagged, `${this.index}/${this.pageMax} \t ${results.length} \t ${((Date.now() - _start)/1000).toFixed(3)}s`);
            log.print();
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
        questions.forEach(q => upsertQiiTa(q));
    }

    parse(innerHTML: string) {
        const $ = cheerio.load(innerHTML);
        const questionLink = $('div.ItemLink__title > a');
        const link = questionLink.attr('href');
        const id = this.getQuestionIdByUrl(link);
        const title = questionLink.text();
        const tagsEl = $('ul.TagList > li > a');
        const tags = tagsEl.map((i, el) => $(el).text()).get().join(',');
        let time, user;
        let info:any = /\d\d\d\d\/\d\d\/\d\d/.exec($('div > div.ItemLink__info').text());
        if (info) {
            time = info[0] ? info[0] : '';
            user = info[0] ? info.input.substring(0, info.index - 1) : '';
        } else {
            info = $('div > div.ItemLink__info').text().split(' posted on ');
            time = info[1] ? info[1] : '';
            user = info[0] ? info[0] : '';
        }

        const comment = Number.parseInt($('span.fa-comment-o').next().text() || 0);
        const like = Number.parseInt($('span.fa-like').next().text() || 0);

        return { id, title, time, user, link, tags, comment, like, source: 'qiita' }
    }

    /**
     * 获取问题列表 URL
     * @param {getQuestionsUrlOptions} options
     * @returns {string}
     */
    getQuestionsUrl(options: getQuestionsUrlOptions): string {
        const { page } = options;
        return `${this.url}${this.tagged}/items/?page=${page}`
    }

    /**
     * 通过问题 URL 获取问题 ID
     * @param {string} questionUrl
     * @returns {string}
     */
    getQuestionIdByUrl(questionUrl: string): string {
        let _s = questionUrl.split('/');
        return _s[_s.length - 1];
    }

}

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
