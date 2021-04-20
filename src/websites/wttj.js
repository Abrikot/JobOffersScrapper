const axios = require('axios');

const location = '45.75917,4.82966'; // Lyon

const queryUrl = 'https://csekhvms53-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.24.12%3Breact-instantsearch%205.3.2%3BJS%20Helper%20(2.28.1)&x-algolia-application-id=CSEKHVMS53&x-algolia-api-key=02f0d440abc99cae37e126886438b266';
async function getChunkOfData(query, startIndex = 0) {
  const encodedQuery = encodeURIComponent(query);
  const encodedLocation = encodeURIComponent(location);
  const params = {
    "requests": [
      {
        "indexName": "wk_cms_jobs_production",
        "params": `query=${encodedQuery}&hitsPerPage=30&maxValuesPerFacet=100&page=${startIndex / 30}&restrictSearchableAttributes=%5B%22name%22%2C%22profile%22%2C%22organization.name%22%2C%22office.city%22%2C%22office.district%22%2C%22office.state%22%2C%22office.country%22%2C%22department%22%2C%22profession.name.fr%22%2C%22profession.category.fr%22%2C%22contract_type_names.fr%22%2C%22sectors.name.fr%22%2C%22sectors.parent.fr%22%5D&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&aroundLatLng=${encodedLocation}&aroundRadius=20000&aroundPrecision=20000&disableTypoToleranceOnAttributes=%5B%22profile%22%5D&filters=website.reference%3Awttj_fr&facets=%5B%22office.country_code%22%2C%22office.state%22%2C%22office.district%22%2C%22office.location%22%2C%22online%22%2C%22remote%22%2C%22contract_type_names.fr%22%2C%22sectors.parent.fr%22%2C%22profession.category.fr%22%2C%22experience_level_minimum%22%2C%22organization.size.fr%22%2C%22language%22%5D&tagFilters=&numericFilters=%5B%22experience_level_minimum%3E%3D0%22%2C%22experience_level_minimum%3C%3D15%22%5D`
      },
      {
        "indexName": "wk_cms_jobs_production",
        "params": `query=${encodedQuery}&hitsPerPage=1&maxValuesPerFacet=100&page=${startIndex / 30}&restrictSearchableAttributes=%5B%22name%22%2C%22profile%22%2C%22organization.name%22%2C%22office.city%22%2C%22office.district%22%2C%22office.state%22%2C%22office.country%22%2C%22department%22%2C%22profession.name.fr%22%2C%22profession.category.fr%22%2C%22contract_type_names.fr%22%2C%22sectors.name.fr%22%2C%22sectors.parent.fr%22%5D&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&aroundLatLng=${encodedLocation}&aroundRadius=20000&aroundPrecision=20000&disableTypoToleranceOnAttributes=%5B%22profile%22%5D&filters=website.reference%3Awttj_fr&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&clickAnalytics=false&facets=experience_level_minimum`
      }
    ]
  };

  const config = {
    headers: {
      'Referer': 'https://www.welcometothejungle.com/'
    }
  };
  const data = await axios.post(queryUrl, params, config);

  return data.data.results[0];
}

function getDisplayUrl(companySlug, offerSlug) {
  return `https://www.welcometothejungle.com/fr/companies/${companySlug}/jobs/${offerSlug}`;
}

function getTotalNumberOfOffers(data) {
  return data.nbHits;
}

function getOffersInChunk(data) {
  return data.hits;
}

function filterOffers(offers) {
  const filteredOffers = offers.filter(offer => offer.originalOffer.contract_type_names.fr === 'CDI');
  return filteredOffers;
}

function formatOffer(offer) {
  return {
    name: offer.name,
    company: offer.organization.name,
    date: new Date(offer.published_at),
    salary: '-',
    link: getDisplayUrl(offer.organization.website_organization.slug, offer.slug),
    originalOffer: offer
  };
}

exports.getTotalNumberOfOffers = getTotalNumberOfOffers;
exports.getOffersInChunk = getOffersInChunk;
exports.filterOffers = filterOffers;
exports.formatOffer = formatOffer;
exports.getChunkOfData = getChunkOfData;