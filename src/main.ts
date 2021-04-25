import * as fs from 'fs';
import * as tools from './tools';
import * as config from './config';

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
    }
    html += '</table>';
    fs.writeFileSync(config.resultFile, html);
}

async function getAllOffers(query) {
    const offers = [];
    for (const website of config.websites) {
        console.log('Retrieving offers from', website.name);
        const newOffers = await tools.getFilteredOffers(website, query);
        offers.push(...newOffers);
    }
    return offers;
}

getAllOffers(config.query).then(makeHtml).catch(e => console.error(e));