abstract class Website {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract getTotalNumberOfOffers(data: object[]): Number;

    abstract getOffersInChunk(data: object[]): object[];

    abstract formatOffer(offer: object): Offer;

    abstract getChunkOfData(query: string, startIndex: Number): object[];

    /**
    * filterOffers
    */
    public filterOffers(offers: Offer[]): Offer[] {
        return offers;
    }
}