import * as fs from 'fs';

import { Website } from "./model/website";
import { Apec } from "./websites/apec";
import { Indeed } from './websites/indeed';
import { LinkedIn } from "./websites/linkedin";
import { WelcomeToTheJungle } from "./websites/wttj";

export const ignoredCompaniesFile = 'resources/ignoredCompanies.json';

export const websites: Website[] = [
    new Apec(),
    new WelcomeToTheJungle(),
    new LinkedIn(),
    new Indeed()
];

console.log('Loading config');
const configFilePath = 'resources/config.json';
export const {
    query,
    resultFile,
    maxOffersPerCompany,
} = JSON.parse(fs.readFileSync(configFilePath, 'utf-8') || '{}');