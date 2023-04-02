# News Web Scrapper

## Description

- A webscrapper that takes news articles from major news outlets and provides an API for getting the news articles by category or outlet.

### Models

1. News Outlet: name, website, url_structure {contains website a pattern `:category` in it.}.
2. Categories: slug {unique}, name {unique} {seeded categories: business, technology, international, sports, showbiz}
3. Article: title, summary, content, link to article, category, outlet, time/date

## Installation

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Cron job commands

## Support

## Stay in touch

## License
