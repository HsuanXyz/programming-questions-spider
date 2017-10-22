import StackOverflowCrawler from './script/stackoverflow';

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

async function main() {
    const crawler = new StackOverflowCrawler(tags['android'].q);
    await crawler.run(1, tags['android'].max);
    console.log('done');
}

main();