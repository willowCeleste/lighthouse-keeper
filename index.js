import fs from 'fs';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { parse } from 'csv-parse/sync';
import slugify from 'slugify';

function replacePeriodsAndSlashes(str) {
    return str.replace(/[./]/g, '-');
}

const args = process.argv.slice(2);
const csvData = fs.readFileSync(args[0], 'utf-8');
const destination = `${args[1]}/lighthouse-results`;

const urls = parse(csvData, {
    columns: true,
    skip_empty_lines: true
});

for (const url of urls) {
    const theUrl = url.url;
    const title = url.title;
    const directory = './results';

    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {logLevel: 'info', output: 'html', onlyCategories: ['accessibility'], port: chrome.port};
    const runnerResult = await lighthouse(theUrl, options);

    // `.report` is the HTML report as a string
    const reportHtml = runnerResult.report;

    let splitUrl = theUrl.split('//')[1];

    if (splitUrl.endsWith('/')) {
        splitUrl = splitUrl.substring(0, splitUrl.length - 1);
    }

    if (!fs.existsSync(destination)) {
        // Create the directory if it doesn't exist
        fs.mkdirSync(destination, { recursive: true });
      }
    fs.writeFileSync(`${destination}/${slugify(title)}.html`, reportHtml);

    await chrome.kill();
}

