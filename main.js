const fs = require('fs');
const tools = require('./tools.js');
const config = require('./config.js');

fs.unlink(config.resultFile, () => { });

function makeHtml(offers) {
    let html = '<table>'
    + '<tr><th>Entreprise</th><th>Date publication</th><th>Intitulé</th><th>Salaire</th></tr>';
    for (const offer of offers.sort((a, b) => b.date - a.date)) {
        html += `<tr>`
        + `<td>${offer.company}</td>`
        + `<td>${offer.date.toLocaleDateString()}</td>`
        + `<td><a href="${offer.link}">${offer.name}</a></td>`
        + `<td>${offer.salary}</td>`
        + `</tr>`;

        if (!offer.link)
            console.log(offer.link, offer.name);
    }
    html += '</table>';
    fs.writeFileSync(config.resultFile, html);
}

async function getAllOffers(query) {
    const offers = [];
    for (const [websiteName, jsFile] of Object.entries(config.websites)) {
        const websiteModule = require('./websites/' + jsFile);
        console.log('Retrieving offers from', websiteName);
        const newOffers = await tools.getFilteredOffers(websiteModule, query);
        offers.push(...newOffers);
    }
    return offers;
}

getAllOffers(config.query).then(makeHtml).catch(e => console.error(e));