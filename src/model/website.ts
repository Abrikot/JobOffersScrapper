import { Offer } from "./offer";

export abstract class Website {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    abstract getTotalNumberOfOffers(data: Record<string, unknown>): number;

    abstract getOffersInChunk(data: Record<string, unknown>): Record<string, unknown>[];

    abstract formatOffer(offer: Record<string, unknown>): Offer;

    abstract getChunkOfData(query: string, startIndex: number): Promise<Record<string, unknown>>;

    public filterOffers(offers: Offer[]): Offer[] {
        return offers;
    }
    
    public get name() : string {
        return this._name;
    }
    
}