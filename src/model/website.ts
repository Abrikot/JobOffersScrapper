import { Offer } from "./offer";

export abstract class Website {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public test() {
        console.log(this);
    }

    abstract getTotalNumberOfOffers(data: Record<string, unknown>): number;

    abstract getOffersInChunk(data: Record<string, unknown>): Record<string, unknown>[];

    abstract formatOffer(offer: Record<string, unknown>): Offer;

    abstract getChunkOfData(query: string, startIndex: number): Promise<Record<string, unknown>>;

    /**
    * filterOffers
    */
    public filterOffers(offers: Offer[]): Offer[] {
        return offers;
    }

    
    public get getName() : string {
        return this.name;
    }
    
}