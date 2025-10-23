import { Article } from "./article";
import { Client } from "./client";

export class Credit {
    id: number;
    prix: number;
    quantite: number;
    client: Client;
    article: Article;
    date: Date;

    constructor() {
        this.id = 0;
        this.prix = 0;
        this.quantite = 0.0;
        this.client = new Client();
        this.article = new Article();
        this.date = new Date();
    }
}
