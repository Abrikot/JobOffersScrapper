import * as fs from 'fs';
import * as config from './config';
import { Website } from './model/website';
import { Offer } from './model/offer';

const ignoredCompaniesFile = config.ignoredCompaniesFile;
const maxOffersPerCompany = config.maxOffersPerCompany;

export function getIgnoredCompanies(): string[] {
    const ignoredCompanies = JSON.parse(fs.readFileSync(ignoredCompaniesFile, 'utf-8') || '[]');
    return ignoredCompanies;
}

export function writeIgnoredCompanies(ignoredCompanies: string[]): void {
    fs.writeFileSync(ignoredCompaniesFile, JSON.stringify(ignoredCompanies, null, 2));
}

export function groupBy<T>(collection: T[], key: string): Record<string, T[]> {
    return collection.reduce(function (accumulator: Record<string, T[]>, newValue: T) {
        (accumulator[newValue[key].toLowerCase()] = accumulator[newValue[key].toLowerCase()] || []).push(newValue);
        return accumulator;
    }, {});
}

async function getAllOffers(website: Website, query: string): Promise<Record<string, unknown>[]> {
    const offers = [];

    let startIndex = 0;
    let totalNumber: number;
    do {
        const data: Record<string, unknown> = await website.getChunkOfData(query, startIndex);
        if (totalNumber === undefined) {
            totalNumber = website.getTotalNumberOfOffers(data);
        }
        const newOffers: Record<string, unknown>[] = website.getOffersInChunk(data);
        offers.push(...newOffers);
        startIndex += newOffers.length;
        console.log(startIndex, 'of', totalNumber);
        if (newOffers.length === 0) {
            break;
        }
    } while (startIndex < totalNumber)

    return offers;
}

function filterOffers(website: Website, offers: Offer[]): Offer[] {
    const groupedOffers: Record<string, Offer[]> = groupBy(offers, 'company');
    const ignoredCompanies: string[] = getIgnoredCompanies();
    for (const [company, offers] of Object.entries(groupedOffers)) {
        if (offers.length >= maxOffersPerCompany && !ignoredCompanies.includes(company.toLowerCase())) {
            ignoredCompanies.push(company.toLowerCase());
        }
    }
    writeIgnoredCompanies(ignoredCompanies);

    const notIgnoredOffers = offers.filter(offer => !ignoredCompanies.includes(offer.company.toLowerCase()));

    const specificFilter = website.filterOffers || (offers => offers);
    return specificFilter(notIgnoredOffers);
}

export async function getFilteredOffers(website: Website, query: string): Promise<Offer[]> {
    const offers: Record<string, unknown>[] = await getAllOffers(website, query);
    const formattedOffers: Offer[] = offers.map(offer => website.formatOffer(offer));
    const filteredOffers: Offer[] = filterOffers(website, formattedOffers);
    const offersCount: number = filteredOffers.length;
    console.log(`Kept ${offersCount} offers`);

    return filteredOffers;
}