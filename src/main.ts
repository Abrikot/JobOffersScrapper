import * as fs from 'fs';
import * as tools from './tools';
import * as config from './config';

fs.unlink(config.resultFile, () => { });

function makeHtml(offers) {
    let html = '<html>'
        + '<head>'
        + '<style>tr:hover {background-color: lightblue;}</style>'
        + '</head>'
        + '<body>'
        + '<table>'
        + '<tr><th>Entreprise</th><th>Date publication</th><th>Intitulé</th><th>Salaire</th></tr>';
    for (const offer of offers.sort((a, b) => b.date - a.date)) {
        html += `<tr>`
            + `<td>${offer.company}</td>`
            + `<td>${offer.date.toLocaleDateString()}</td>`
            + `<td><a href="${offer.link}">${offer.name}</a></td>`
            + `<td>${offer.salary}</td>`
            + `</tr>`;
    }
    html += '</table>'
        + `<div>Generated on ${new Date().toLocaleString()}</div>`
        + '</body>'
        + '</html>';

    fs.writeFileSync(config.resultFile, html);
}

async function getAllOffers(query) {
    const offers = [];
    for (const website of config.websites) {
        console.log('Retrieving offers from', website.name);
        const newOffers = await website.getFilteredOffers(query);
        offers.push(...newOffers);
    }
    const filteredOffers = tools.filterOffers(offers);
    console.log('-------------');
    console.log(`Kept a total of ${filteredOffers.length} offers.`)
    return filteredOffers;
}

getAllOffers(config.query)
    .then(makeHtml)
    .catch(e => console.error(e));