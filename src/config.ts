import { Website } from "./model/website";
import { Apec } from "./websites/apec";
import { LinkedIn } from "./websites/linkedin";
import { WelcomeToTheJungle } from "./websites/wttj";

export const query = 'Développeur';
export const resultFile = 'offers.html';
export const ignoredCompaniesFile = 'resources/ignoredCompanies.json';
export const maxOffersPerCompany = 10;

export const websites : Website[] = [
    new Apec(),
    new WelcomeToTheJungle(),
    new LinkedIn()
];