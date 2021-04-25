import { Offer } from "./offer";

export abstract class Website {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    protected abstract getAllOffers(query: string): Promise<Offer[]>;
    
    public async getFilteredOffers(query: string): Promise<Offer[]> {
        const offers: Offer[] = await this.getAllOffers(query);
        const filteredOffers: Offer[] = this.specificFilterOffers(offers);
        const offersCount: number = filteredOffers.length;
        console.log(`Kept ${offersCount} offers`);
    
        return filteredOffers;
    }

    protected specificFilterOffers(offers: Offer[]): Offer[] {
        return offers;
    }
    
    public get name() : string {
        return this._name;
    }
}