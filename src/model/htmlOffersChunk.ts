import { Offer } from "./offer";

export class HtmlOffersChunk {
    private _offers : Offer[];
    private _totalNumberOfOffers : number;

    constructor(offers: Offer[], totalNumberOfOffers: number) {
        this._offers = offers;
        this._totalNumberOfOffers = totalNumberOfOffers;
    }
    
    public get offers() : Offer[] {
        return this._offers;
    }

    public get totalNumberOfOffers() : number {
        return this._totalNumberOfOffers;
    }
}