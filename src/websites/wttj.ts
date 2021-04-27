import axios from 'axios';
import { JsonWebsite } from '../model/jsonWebsite';
import { Offer } from '../model/offer';

export class WelcomeToTheJungle extends JsonWebsite {
  private static location = '45.75917,4.82966'; // Lyon
  private static queryUrl = 'https://csekhvms53-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.24.12%3Breact-instantsearch%205.3.2%3BJS%20Helper%20(2.28.1)&x-algolia-application-id=CSEKHVMS53&x-algolia-api-key=02f0d440abc99cae37e126886438b266';

  constructor() {
    super('Welcome to the Jungle');
  }

  public getTotalNumberOfOffers(data: Record<string, unknown>): number {
    return data['nbHits'] as number;
  }
  public getOffersInChunk(data: Record<string, unknown>): Record<string, unknown>[] {
    return data['hits'] as Record<string, unknown>[];
  }
  public formatOffer(offer: Record<string, unknown>): Offer {
    return new Offer(
      offer['name'] as string,
      offer['organization']['name'] as string,
      new Date(offer['published_at'] as string),
      '-',
      WelcomeToTheJungle.getDisplayUrl(offer['organization']['website_organization']['slug'], offer['slug'] as string),
      offer
    )
  }
  public async getChunkOfData(query: string, startIndex: number): Promise<Record<string, unknown>> {
    const encodedQuery = encodeURIComponent(query);
    const encodedLocation = encodeURIComponent(WelcomeToTheJungle.location);
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
    const data = await axios.post(WelcomeToTheJungle.queryUrl, params, config);

    return data.data.results[0];
  }

  private static getDisplayUrl(companySlug: string, offerSlug: string) {
    return `https://www.welcometothejungle.com/fr/companies/${companySlug}/jobs/${offerSlug}`;
  }
}