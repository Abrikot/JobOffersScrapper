# JobOffersScrapper

Scrapping common websites to find the job offer you are looking for!

## How to use
Install Node.js.
Run `npm install` inside the workspace. This will install the dependencies this project requires.

If you don't want to scrap a website, you can simply comment its line out in the `src/config.ts` file. 

If scrapping LinkedIn, create a `src/websites/credentials.ts` file containing the following:
```
export const credentials {
    linkedin: {
        'csrf-token': <---- Your csrf-token ---->,
        JSESSIONID: <---- JSESSIONID ---->,
        li_at: <---- Your li_at ---->
    }
};
```
This information can be found in any request on LinkedIn search feature.

Before running the script, it has to be transpiled from TypeScript to JavaScript. It is done by running `tsc`.
Once everything's fine, you can run `node dist/main.js`. It'll start scrapping websites. When it's done, a `offers.html` file we'll be created in the workspace.

## Filtering
This project will filter out big companies - defined as companies that have more than 10 offers on the same website. This can be configured in the `src/config.ts` file, property `maxOffersPerCompany`.
Depending on the website, other filters can be applied.

### APEC filter
APEC offers are classified with a "score" value. If an offer's score value is less than a given value, this offer is filtered out. This default value is 15.

### Welcome to the Jungle filter
Welcome to the Jungle offer the possibility to filter on the contract type. Only unlimited contract (= CDI) are kept. Others are discarded.

### LinkedIn filter
LinkedIn sometimes allows offers without company names. Those are filtered out as they don't demonstrate a good enough offer quality.
