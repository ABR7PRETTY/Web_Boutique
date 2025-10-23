import { Categorie } from "./categorie";

export class Article {

    id: number;
    libelle: string;
    image: File | null = null;
    imageUrl: string | any;
    quantite: number;
    prix: number;
    categorie: Categorie;


    constructor() {
        this.id = 0;
        this.libelle = '';
        this.quantite = 0;
        this.prix = 0;
        this.categorie = new Categorie();
    }
}
