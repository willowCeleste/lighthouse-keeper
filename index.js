import fs from 'fs';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { parse } from 'csv-parse/sync';
import slugify from 'slugify';

const args = process.argv.slice(2);

// Some error checking before we do anything.
if (!args.length) {
    throw new Error('You must provide a path to both an input CSV and an output path!');
}

if (!args[0].endsWith('.csv')) {
    throw new Error('Input file must be a CSV!');
}

if (!args[1]) {
    throw new Error('You must provide an output path for the results!');
}

const csvData = fs.readFileSync(args[0], 'utf-8');
const destination = `${args[1]}/lighthouse-results`;

const urls = parse(csvData, {
    columns: true,
    skip_empty_lines: true
});

for (const url of urls) {
    const theUrl = url.url;
    const title = url.title;

    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {logLevel: 'info', output: 'html', onlyCategories: ['accessibility'], port: chrome.port};
    const runnerResult = await lighthouse(theUrl, options);

    const reportHtml = runnerResult.report;

    let splitUrl = theUrl.split('//')[1];

    if (splitUrl.endsWith('/')) {
        splitUrl = splitUrl.substring(0, splitUrl.length - 1);
    }

    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
    fs.writeFileSync(`${destination}/${slugify(title)}.html`, reportHtml);

    await chrome.kill();
}
