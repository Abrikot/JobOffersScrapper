# WorkOffersScrapper

Scrapping common websites to find the job offer you are looking for!

## How to use
Install Node.js.
Run `npm install` inside the workspace. This will instace the dependencies this project requires.

If scrapping LinkedIn, create a `src/websites/credentials.js` file containing the following:
```
module.exports = {
    credentials: {
        linkedin: {
            'csrf-token': <---- Your csrf-token ---->,
            JSESSIONID: <---- JSESSIONID ---->,
            li_at: <---- Your li_at ---->
        }
    }
};
```
This information can be found in any request on LinkedIn search feature.

Once everything's fine, you can run `node src/main.js`. It'll start scrapping website. When it's done, a `offers.html` file we'll be created in the workspace.