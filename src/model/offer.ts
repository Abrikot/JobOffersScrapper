export class Offer {
    private _name: string;
    private _company: string;
    private _date: Date;
    private _salary: string;
    private _link: string;
    private _originalOffer: Record<string, unknown>;

    constructor(name: string,
        company: string,
        date: Date,
        salary: string,
        link: string,
        originalOffer: Record<string, unknown>) {
        this._name = name;
        this._company = company;
        this._date = date;
        this._salary = salary;
        this._link = link;
        this._originalOffer = originalOffer;
    }

    public get name(): string {
        return this._name;
    }

    public get company(): string {
        return this._company;
    }

    public get date(): Date {
        return this._date;
    }

    public get salary(): string {
        return this._salary;
    }

    public get link(): string {
        return this._link;
    }

    public get originalOffer(): Record<string, unknown> {
        return this._originalOffer;
    }
}