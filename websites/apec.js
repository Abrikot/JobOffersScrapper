const axios = require('axios');

const range = 100;

const queryUrl = 'https://www.apec.fr/cms/webservices/rechercheOffre';
const displayUrl = 'https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/';

const locations = [
    "596717"    // Lyon
];

function getDisplayUrl(offerNumber) {
    return displayUrl + offerNumber;
}

async function getChunkOfData(query, startIndex = 0) {
    const params = {
        "lieux": locations,
        "fonctions": [],
        "statutPoste": [],
        "typesContrat": [],
        "typesConvention": [],
        "niveauxExperience": [],
        "idsEtablissement": [],
        "secteursActivite": [],
        "idNomZonesDeplacement": [],
        "positionNumbersExcluded": [],
        "typeClient": "CADRE",
        "sorts": [{ "type": "DATE", "direction": "DESCENDING" }],
        "pagination": { "range": range, "startIndex": startIndex },
        "activeFiltre": true,
        "pointGeolocDeReference": { "distance": 0 },
        "motsCles": query
    };
    const data = await axios.post(queryUrl, params);
    return data.data;
}

const minScore = 15;

function filterOffers(offers) {
    const filteredOffers = offers.filter(offer => offer.originalOffer.score > minScore);
    return filteredOffers;
}

function getTotalNumberOfOffers(data) {
    return data.totalCount;
}

function getOffersInChunk(data) {
    return data.resultats;
}

function formatOffer(offer) {
    return {
        name: offer.intituleSurbrillance,
        firm: offer.nomCommercial,
        date: new Date(offer.datePublication),
        salary: offer.salaireTexte,
        link: getDisplayUrl(offer.numeroOffre),
        originalOffer: offer
    };
}

exports.getTotalNumberOfOffers = getTotalNumberOfOffers;
exports.getOffersInChunk = getOffersInChunk;
exports.filterOffers = filterOffers;
exports.formatOffer = formatOffer;
exports.getChunkOfData = getChunkOfData;