const axios = require('axios');
const credentials = require('./credentials').credentials;

let companies = new Map();

async function getChunkOfData(query, startIndex = 0) {
    const encodedQuery = encodeURIComponent(query);
    const filters = {
        jobType: 'F',
        timePostedRange: 'r2592000',
        geoUrn: 'urn:li:fs_geo:103815258',
        locationFallback: 'Lyon, Auvergne-Rhône-Alpes, France',
        distance: '5',
        sortBy: 'R',
        resultType: 'JOBS'
    };
    const queryUrl = `https://www.linkedin.com/voyager/api/search/hits?`
        + `decorationId=com.linkedin.voyager.deco.jserp.WebJobSearchHitWithSalary-17`
        + `&count=50`
        + `&filters=List(${Object.entries(filters).map(([key, value]) => key + '->' + encodeURIComponent(value)).join(',')})`
        + `&keywords=${encodedQuery}`
        + `&origin=JOB_SEARCH_PAGE_JOB_FILTER`
        + `&q=jserpFilters`
        + `&queryContext=List(primaryHitType-%3EJOBS,spellCorrectionEnabled-%3Etrue)`
        + `&start=${startIndex}`
        + `&topNRequestedFlavors=List(HIDDEN_GEM,IN_NETWORK,SCHOOL_RECRUIT,COMPANY_RECRUIT,SALARY,JOB_SEEKER_QUALIFIED,PREFERRED_COMMUTE,PRE_SCREENING_QUESTIONS,SKILL_ASSESSMENTS,ACTIVELY_HIRING_COMPANY,TOP_APPLICANT)`;
    const cookies = {
        JSESSIONID: credentials.linkedin.JSESSIONID,
        li_at: credentials.linkedin.li_at
    };
    const config = {
        headers: {
            'csrf-token': credentials.linkedin['csrf-token'],
            'Cookie': Object.entries(cookies).map(([key, value]) => `${key}="${value}"`).join('; '),
            'Accept': 'application/vnd.linkedin.normalized+json+2.1',
            'x-li-prefetch': 1,
            'x-li-lang': 'fr_FR',
            'x-restli-protocol-version': '2.0.0',
        }
    };
    const data = await axios.get(queryUrl, config);

    let companiesDefinition = data.data.included.filter(element => element['$type'] === 'com.linkedin.voyager.organization.Company');
    companiesDefinition.forEach(companyDefinition => companies.set(companyDefinition.entityUrn, companyDefinition.name));

    let offers = data.data.included.filter(element => element['$type'] === 'com.linkedin.voyager.jobs.JobPosting');
    offers.forEach(normalizeOfferCompanyName);
    const offersWithCompanyName = offers.filter(offer => offer.companyDetails.companyName); // We don't want offers which are not linked to any company

    return {
        offers: offersWithCompanyName,
        paging: data.data.data.paging
    };
}

function getCompanyName(offer) {
    return offer.companyDetails.companyName || companies.get(offer.companyDetails.company);
}

function normalizeOfferCompanyName(offer) {
    offer.companyDetails.companyName = getCompanyName(offer);
}

function getTotalNumberOfOffers(data) {
    return data.paging.total;
}

function getOffersInChunk(data) {
    return data.offers;
}

function getDisplayLink(offer) {
    if (offer.applyMethod.companyApplyUrl) {
        return offer.applyMethod.companyApplyUrl;
    }
    const parts = offer.entityUrn.split(':');
    return 'https://www.linkedin.com/jobs/search/?currentJobId=' + parts[parts.length - 1];
}

function formatOffer(offer) {
    return {
        name: offer.title,
        company: offer.companyDetails.companyName,
        date: new Date(offer.listedAt),
        salary: '-',
        link: getDisplayLink(offer),
        originalOffer: offer
    };
}

exports.getTotalNumberOfOffers = getTotalNumberOfOffers;
exports.getOffersInChunk = getOffersInChunk;
exports.formatOffer = formatOffer;
exports.getChunkOfData = getChunkOfData;