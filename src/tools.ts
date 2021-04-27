import * as fs from 'fs';
import * as config from './config';
import { Offer } from './model/offer';

const ignoredCompaniesFile = config.ignoredCompaniesFile;
const maxOffersPerCompany = config.maxOffersPerCompany;

function getIgnoredCompanies(): string[] {
    const ignoredCompanies = JSON.parse(fs.readFileSync(ignoredCompaniesFile, 'utf-8') || '[]');
    return ignoredCompanies;
}

function writeIgnoredCompanies(ignoredCompanies: string[]): void {
    fs.writeFileSync(ignoredCompaniesFile, JSON.stringify(ignoredCompanies, null, 2));
}

function groupBy<T>(collection: T[], key: string): Record<string, T[]> {
    return collection.reduce(function (accumulator: Record<string, T[]>, newValue: T) {
        (accumulator[newValue[key].toLowerCase()] = accumulator[newValue[key].toLowerCase()] || []).push(newValue);
        return accumulator;
    }, {});
}

export function filterOffers(offers: Offer[]): Offer[] {
    const groupedOffers: Record<string, Offer[]> = groupBy(offers, 'company');
    const ignoredCompanies: string[] = getIgnoredCompanies();
    for (const [company, offers] of Object.entries(groupedOffers)) {
        if (offers.length >= maxOffersPerCompany && !ignoredCompanies.includes(company.toLowerCase())) {
            ignoredCompanies.push(company.toLowerCase());
        }
    }
    writeIgnoredCompanies(ignoredCompanies);

    const notIgnoredOffers = offers.filter(offer => !ignoredCompanies.includes(offer.company.toLowerCase()));

    const specificFilter = this.specificFilterOffers || (offers => offers);
    return specificFilter(notIgnoredOffers);
}