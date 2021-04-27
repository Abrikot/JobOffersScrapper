import axios from "axios";
import { JSDOM } from 'jsdom';
import { HtmlOffersChunk } from "../model/htmlOffersChunk";
import { HtmlWebsite } from "../model/htmlWebsite";
import { Offer } from "../model/offer";

export class Indeed extends HtmlWebsite {
    private static displayUrl = 'https://fr.indeed.com';

    constructor() {
        super('Indeed');
    }

    getTotalNumberOfOffers(data: Record<string, unknown>): number {
        return data.totalNumberOfOffers as number;
    }
    getOffersInChunk(data: Record<string, unknown>): Record<string, unknown>[] {
        return data.offers as Record<string, unknown>[];
    }
    formatOffer(offer: Record<string, unknown>): Offer {
        return offer as unknown as Offer;
    }

    async getChunkOfData(query: string, startIndex: number): Promise<HtmlOffersChunk> {
        const encodedQuery = encodeURIComponent(query);
        const queryUrl = `https://fr.indeed.com/jobs?q=${encodedQuery}`
        + `&l=Lyon+%2869%29`
        + `&start=${startIndex}`
        + `&radius=5`
        + `&fromage=30`
        + `&sort=date`
        + `&limit=50`
        + `&jt=permanent`
        + `&sr=directhire`;
        const html = (await axios({
            method: 'get',
            url: queryUrl,
            transformResponse: response => response
        })).data;

        const document: HTMLDocument = new JSDOM(html).window.document;

        if (!document.textContent) {
            throw new Error('Indeed uses a CATPCHA when detecting a bot. Try using a proxy to unblock the scrapper.');
        }

        return new HtmlOffersChunk(
            Indeed.getOffersFromDocument(document),
            Indeed.getTotalNumberOfOffersFromHtml(document)
        );
    }

    private static getOffersFromDocument(document: HTMLDocument): Offer[] {
        const cards: HTMLCollectionOf<Element> = document.getElementsByClassName('jobsearch-SerpJobCard');
        return Array.from(cards, Indeed.getOfferFromOfferCard);
    }

    private static getOfferFromOfferCard(card: Element): Offer {
        const titleElement: Element = card.getElementsByClassName('jobtitle')[0];
        const title = titleElement.textContent.trim();
        const link = Indeed.displayUrl + titleElement['href'];
        const company = card.getElementsByClassName('company')[0].textContent.trim();
        const salary = card.getElementsByClassName('salaryText')[0]?.textContent.trim() || '';
        const phrasedAge = card.getElementsByClassName('date date-a11y')[0].textContent.trim().normalize();

        return new Offer(
            title,
            company,
            Indeed.getDateFromAge(phrasedAge),
            salary,
            link,
            null
        );
    }

    private static matchStringPattern(pattern: RegExp, value: string): number {
        if (pattern.test(value)) {
            return Number.parseInt(pattern.exec(value)[1]);
        }
        return 0;
    }

    private static normalizeSpacesPattern = /\s*/g;
    private static moreThanXDaysPattern = /^Il y a plus de (\d*) jours$/i;
    private static exactXDaysPattern = /^Il y a (\d*) jour(s?)$/i;

    private static getDateFromAge(phrasedAge: string): Date {
        const normalizedPhrasedAge = phrasedAge.replace(Indeed.normalizeSpacesPattern, ' ');
        const age = Indeed.matchStringPattern(Indeed.moreThanXDaysPattern, normalizedPhrasedAge)
            || Indeed.matchStringPattern(Indeed.exactXDaysPattern, normalizedPhrasedAge);

        if (!age) return undefined;

        const now = new Date();
        return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - age);
    }

    private static countPhrasePattern = /^Page \d* de (\d*) emplois$/
    private static getTotalNumberOfOffersFromHtml(document: HTMLDocument): number {
        const countPhrase = document.getElementById('searchCountPages').textContent.trim();
        return Indeed.matchStringPattern(Indeed.countPhrasePattern, countPhrase);
    }
}