import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import upsertGitHubRepo from "../db/github:repo";
import fetch from 'node-fetch';

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
    get log() {
        const keys = Object.keys(this._log);
        if (keys.length === 0) return;
        let logs = '';
        keys.forEach(e => logs += `${this._log[e]} | `);
        return logs;
    },
    print() {
        console.log(this.log)
    },
    warn() {
        console.warn(this.log)
    }
};

export default class QiItaCrawler {

    url: string = 'https://api.github.com/search/repositories?q=';
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

    }

    async json(start) {

        this.index = start;

        while ((this.index < this.pageMax) || this.pageMax === 0) {
            const _start = Date.now();
            await fetch(`${this.url}${this.tagged}&page=${this.index}`)
            .then(res => res.json())
            .then(json => {
                if (!json.incomplete_results && json.items && json.items.length > 0) {
                    this.pageMax = Math.ceil(json.total_count / 100);
                    const {items} = json;
                    this.saveQuestions(items);
                    log.addLog(this.tagged, `${this.index}/${this.pageMax} \t ${items.length}  \t ${((Date.now() - _start) / 1000).toFixed(3)}s`);
                    log.print();
                    this.index++;
                    if (this.index >= this.pageMax) {
                        this.index = -1;
                    }
                } else {
                    if (json.message) {
                        console.log(json.message)
                    } else {
                        log.addLog(this.tagged, `${this.index}/${this.pageMax} \t ${0}  \t ${((Date.now() - _start) / 1000).toFixed(3)}s \t fail`);
                        log.warn();
                    }

                }
            }).catch(err => {
                console.error(err)
            })
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close()
        }
    }

    saveQuestions(res) {
        res.forEach(e => upsertGitHubRepo({
            item: e,
            id: e.id,
            name: e.name,
            description: e.description
        }));
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
        let info: any = /\d\d\d\d\/\d\d\/\d\d/.exec($('div > div.ItemLink__info').text());
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

        return {id, title, time, user, link, tags, comment, like, source: 'qiita'}
    }

    /**
     * 获取问题列表 URL
     * @param {getQuestionsUrlOptions} options
     * @returns {string}
     */
    getQuestionsUrl(options: getQuestionsUrlOptions): string {
        const {page} = options;
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

new QiItaCrawler('angular&sort=stars&order=desc&per_page=100').run(1);