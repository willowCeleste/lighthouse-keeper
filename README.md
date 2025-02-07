# Lighthouse Keeper

This is, at the moment, a tiny command line tool for generating Lighthouse HTML reports. It takes a CSV of URLs and generates a folder of Lighthouse reports for those URLs in a given directory.

## How To Use
 1. Clone or download the repo.
 1. CD into the root of the repo.
 1. From the command line run `npm run <path-to-csv> <path-to-output-directory>` replacing the arguments in brackets with the file path and directory of your choice.

 ## CSV Format

 The CSV has two required columns: `url` and `title`. 

 | url                         | title   |
|-----------------------------|---------|
| https://example.com         | Home    |
| https://example.com/about   | About   |
| https://example.com/contact | Contact |
