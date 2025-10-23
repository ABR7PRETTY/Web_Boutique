import { Article } from "./article";

export class Vente {

    id: number;
    quantite : number;
    prix : number;
    article : Article;
    date : Date;
    constructor() {
        this.id = 0;
        this.quantite = 0;
        this.prix = 0;
        this.article = new Article();
        this.date = new Date();
    }
}
