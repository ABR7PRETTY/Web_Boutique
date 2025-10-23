import { Client } from "./client";

export class Paiement {
    id: number;
    montant: number;
    date: Date;
    client: Client;

    constructor() {
        this.id = 0;
        this.montant = 0;
        this.date = new Date();
        this.client = new Client();
    }
}
