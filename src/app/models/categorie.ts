export class Categorie {
    id: number;
    libelle: string;
    description: string;
    imageUrl: any;
    image: File | null = null;


    constructor(){
        this.id = 0;
        this.libelle = '';
        this.description = '';
    }
}


