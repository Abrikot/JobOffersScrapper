import axios from 'axios';
import { credentials } from './credentials';
import { Offer } from '../model/offer';
import { Website } from '../model/website';

export class LinkedIn extends Website {
    private static companies = new Map();

    constructor() {
        super('LinkedIn');
    }

    public getTotalNumberOfOffers(data: Record<string, unknown>): number {
        return data['paging']['total'];
    }
    public getOffersInChunk(data: Record<string, unknown>): Record<string, unknown>[] {
        return data['offers'] as Record<string, unknown>[];
    }
    public formatOffer(offer: Record<string, unknown>): Offer {
        return new Offer(
            offer.title as string,
            offer['companyDetails']['companyName'] as string,
            new Date(offer['listedAt'] as string),
            '-',
            this.getDisplayLink(offer),
            offer
        )
    }
    public async getChunkOfData(query: string, startIndex: number): Promise<Record<string, unknown>> {
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

        const companiesDefinition = data.data.included.filter(element => element['$type'] === 'com.linkedin.voyager.organization.Company');
        companiesDefinition.forEach(companyDefinition => LinkedIn.companies.set(companyDefinition.entityUrn, companyDefinition.name));

        const offers = data.data.included.filter(element => element['$type'] === 'com.linkedin.voyager.jobs.JobPosting');
        offers.forEach(offer => this.normalizeOfferCompanyName(offer));
        const offersWithCompanyName = offers.filter(offer => offer.companyDetails.companyName); // We don't want offers which are not linked to any company

        return {
            'offers': offersWithCompanyName,
            'paging': data.data.data.paging
        };
    }

    private getCompanyName(offer: Record<string, unknown>) {
        return offer.companyDetails['companyName'] || LinkedIn.companies.get(offer.companyDetails['company']);
    }

    private normalizeOfferCompanyName(offer: Record<string, unknown>) {
        offer.companyDetails['companyName'] = this.getCompanyName(offer);
    }

    private getDisplayLink(offer: Record<string, unknown>) {
        if (offer['applyMethod']['companyApplyUrl']) {
            return offer['applyMethod']['companyApplyUrl'];
        }
        const parts = (offer.entityUrn as string).split(':');
        return 'https://www.linkedin.com/jobs/search/?currentJobId=' + parts[parts.length - 1];
    }
}