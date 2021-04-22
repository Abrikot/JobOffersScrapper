export class Offer {
    private name: string;
    private company: string;
    private date: Date;
    private salary: string;
    private link: string;
    private originalOffer: Record<string, unknown>;

    constructor(name: string,
        company: string,
        date: Date,
        salary: string,
        link: string,
        originalOffer: Record<string, unknown>) {
        this.name = name;
        this.company = company;
        this.date = date;
        this.salary = salary;
        this.link = link;
        this.originalOffer = originalOffer;
    }

    public get getName(): string {
        return this.name;
    }

    public get getCompany(): string {
        return this.company;
    }

    public get getDate(): Date {
        return this.date;
    }

    public get getSalary(): string {
        return this.salary;
    }

    public get getLink(): string {
        return this.link;
    }

    public get getOriginalOffer(): Record<string, unknown> {
        return this.originalOffer;
    }
}