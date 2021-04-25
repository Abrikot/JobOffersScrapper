import { HtmlOffersChunk } from "./htmlOffersChunk";
import { Offer } from "./offer";
import { Website } from "./website";

export abstract class HtmlWebsite extends Website {
    protected abstract getChunkOfData(query: string, startIndex: number): Promise<HtmlOffersChunk>;

    protected async getAllOffers(query: string): Promise<Offer[]> {
        const offers = [];
    
        let startIndex = 0;
        let totalNumber: number;
        do {
            const data: HtmlOffersChunk = await this.getChunkOfData(query, startIndex);
            if (totalNumber === undefined) {
                totalNumber = data.totalNumberOfOffers;
            }
            const newOffers: Offer[] = data.offers;
            offers.push(...newOffers);
            startIndex += newOffers.length;
            console.log(startIndex, 'of', totalNumber);
            if (newOffers.length === 0) {
                break;
            }
        } while (startIndex < totalNumber)
    
        return offers;
    }
}