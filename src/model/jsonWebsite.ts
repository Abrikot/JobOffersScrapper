import { Offer } from "./offer";
import { Website } from "./website";

export abstract class JsonWebsite extends Website {
    protected abstract getChunkOfData(query: string, startIndex: number): Promise<Record<string, unknown>>;
    
    abstract getTotalNumberOfOffers(data: Record<string, unknown>): number;

    abstract getOffersInChunk(data: Record<string, unknown>): Record<string, unknown>[];

    abstract formatOffer(offer: Record<string, unknown>): Offer;
    
    protected async getAllOffers(query: string): Promise<Offer[]> {
        const offers = [];
    
        let startIndex = 0;
        let totalNumber: number;
        do {
            const data: Record<string, unknown> = await this.getChunkOfData(query, startIndex);
            if (totalNumber === undefined) {
                totalNumber = this.getTotalNumberOfOffers(data);
            }
            const newOffers: Record<string, unknown>[] = this.getOffersInChunk(data);
            offers.push(...newOffers);
            startIndex += newOffers.length;
            console.log(startIndex, 'of', totalNumber);
            if (newOffers.length === 0) {
                break;
            }
        } while (startIndex < totalNumber)
    
        return offers.map(offer => this.formatOffer(offer));
    }
}