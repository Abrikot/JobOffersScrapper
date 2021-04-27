import { Offer } from "./offer";
import { Website } from "./website";

export abstract class JsonWebsite extends Website {
    abstract getTotalNumberOfOffers(data: Record<string, unknown>): number;

    abstract getOffersInChunk(data: Record<string, unknown>): Record<string, unknown>[];

    abstract formatOffer(offer: Record<string, unknown>): Offer;

    abstract getChunkOfData(query: string, startIndex: number): Promise<Record<string, unknown>>;
    
    protected async getAllOffers(query: string): Promise<Record<string, unknown>[]> {
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
    
        return offers;
    }
    
    public async getFilteredOffers(query: string): Promise<Offer[]> {
        const offers: Record<string, unknown>[] = await this.getAllOffers(query);
        const formattedOffers: Offer[] = offers.map(offer => this.formatOffer(offer));
        const filteredOffers: Offer[] = this.specificFilterOffers(formattedOffers);
        const offersCount: number = filteredOffers.length;
        console.log(`Kept ${offersCount} offers`);
    
        return filteredOffers;
    }
}