import axios from 'axios';
import { Offer } from '../model/offer';
import { Website } from '../model/website';

export class Apec extends Website {
    private range = 100;

    private queryUrl = 'https://www.apec.fr/cms/webservices/rechercheOffre';
    private displayUrl = 'https://www.apec.fr/candidat/recherche-emploi.html/emploi/detail-offre/';

    private locations = [
        "596717"    // Lyon
    ];

    minScore = 15;

    constructor() {
        super('Apec');
    }

    private getDisplayUrl(offerNumber: string): string {
        return this.displayUrl + offerNumber;
    }

    public getTotalNumberOfOffers(data: Record<string, unknown>): number {
        return data['totalCount'] as number;
    }
    public getOffersInChunk(data: Record<string, unknown>): Record<string, unknown>[] {
        return data['resultats'] as Record<string, unknown>[];
    }
    public formatOffer(offer: Record<string, unknown>): Offer {
        console.log(this);
        return new Offer(
            offer.intituleSurbrillance as string,
            offer.nomCommercial as string,
            new Date(offer['datePublication'] as string),
            offer.salaireTexte as string,
            this.getDisplayUrl(offer['numeroOffre'] as string),
            offer
        );
    }
    public async getChunkOfData(query: string, startIndex: number): Promise<Record<string, unknown>> {
        const params = {
            "lieux": this.locations,
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
            "pagination": { "range": this.range, "startIndex": startIndex },
            "activeFiltre": true,
            "pointGeolocDeReference": { "distance": 0 },
            "motsCles": query
        };
        const data = await axios.post(this.queryUrl, params);
        return data.data;
    }

    public filterOffers(offers: Offer[]): Offer[] {
        return offers.filter(offer => offer.getOriginalOffer.score > this.minScore);
    }
}