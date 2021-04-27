import { Offer } from "./offer";

export abstract class Website {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    protected abstract getAllOffers(query: string): Promise<Record<string, unknown>[]>;
    
    public abstract getFilteredOffers(query: string): Promise<Offer[]>;

    protected specificFilterOffers(offers: Offer[]): Offer[] {
        return offers;
    }
    
    public get name() : string {
        return this._name;
    }
    
}