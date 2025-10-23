import { AfterViewInit, Component } from '@angular/core';
import { Article } from '../../models/article';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CategorieService } from '../../services/categorie';
import { Categorie } from '../../models/categorie';
import { Client } from '../../models/client';
import { Credit } from '../../models/credit';
import 'datatables.net';
import { VenteService } from '../../services/vente';
import { RavitaillementService } from '../../services/ravitaillement';
import { ClientService } from '../../services/client';
import { CreditService } from '../../services/credit';
import { constantes } from '../../constantes';
declare var $: any;


@Component({
  selector: 'app-article',
  imports: [FormsModule, CommonModule],
  templateUrl: './article.html',
  styleUrl: './article.css'
})
export class ArticleComponent implements AfterViewInit{

  page='liste';
  articleAjout : Article = new Article();
  articleModif : Article = new Article();
  tableauArticle : Article[] = [];
  tableauCategorie : Categorie[] = [];
  tableauClient: Client[] = [];
  categorieId : number = 0;
  currentCat : any = {};


  constructor( private articleService : ArticleService, private categorieService : CategorieService,private venteService : VenteService ,
    private ravitaillementService : RavitaillementService, private clientService : ClientService, private creditService : CreditService,
    private route: ActivatedRoute, private http: HttpClient, private sanitizer: DomSanitizer) {  }

  ngOnInit() : void{
    this.getAllCategories();
    this.getAllClient();

    this.route.paramMap.subscribe(params => {
      this.categorieId = Number(params.get('id'));
      if(this.categorieId){
        this.getAllArticle(this.categorieId);
        this.getCurrentCat(this.categorieId);
      }
      
    });
  
  }

  ngAfterViewInit(): void {
    // Rien ici, l'init se fera après chargement des données
  }

  pageListe(){
    this.page = 'liste';
  }

  pageAjout(){
    this.articleAjout = new Article();
    this.articleAjout.categorie.id = this.categorieId;
    this.page = 'ajout';
  }

  pageModif(article : Article){
    this.articleModif = article;
    this.page = 'modif';
  }


  getAllArticle(id : number) {
    
    this.articleService.getAllArticle(id).subscribe(
      (articles: Array<Article>) => {
    this.tableauArticle = articles.map(article => {
      return {
        ...article,
        imageUrl: this.sanitizer.bypassSecurityTrustUrl(
          constantes.apiUrl + article.imageUrl
        )
      };
    });
  

        setTimeout(() => $('#basic-datatables').DataTable(), 400);

      },
      (error) => {
        console.log("Erreur lors de la récupération des articles", error);
      }
    )
  }

  getAllCategories() {
    this.categorieService.getAllCategorie().subscribe(
      (value: Array<Categorie>) => {
        this.tableauCategorie = value;

      },
      (error) => {
        console.log("Erreur lors de la récupération des categories", error);
      }
    )
  }

  getAllClient() {
    this.clientService.getAllClient().subscribe(
      (value: Array<Client>) => {
        this.tableauClient = value;

      },
      (error) => {
        console.log("Erreur lors de la récupération des categories", error);
      }
    )
  }

  getCurrentCat(id:number) {
    this.categorieService.findCategorie(id).subscribe(
      (value:Categorie) => {
        this.currentCat = value;
        this.articleAjout.categorie = this.currentCat;
      },
      (error) => {
        console.log("Erreur lors de la récupération des categories", error);
      }
    )
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.articleAjout.image = file;
  }

  addArticle(){
    this.articleService.saveArticle(this.articleAjout).subscribe(
      (value) => {
        this.showAlert1('Article enregistré', 'success');
        this.getAllArticle(this.categorieId);
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de l'enregistrement de la article", error);
      }
    )
  }

  supArticle(article:Article) {
    this.articleService.deleteArticle(article.id).subscribe(
      (value) => {
        this.showAlert1('Article supprimé', 'success');
        this.getAllArticle(this.categorieId);
      },
      (error) => {
        console.log("Erreur lors de la suppression de l'article", error);
      }
    )
  }

  vendreArticle(quantite:number, prix:number , articleId:number){
    this.venteService.addVenteByArticleId(quantite, prix, articleId).subscribe(
      (value) => {
        this.showAlert1('Article vendu', 'success');
        this.getAllArticle(this.categorieId);
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de la vente de l'article", error);
      }
    )
  }

  crediterArticle(quantite:number, prix:number , articleId:number, clientId:number){
    this.creditService.addCreditByArticleId(quantite, prix, articleId, clientId).subscribe(
      (value) => {
        this.showAlert1('Article vendu', 'success');
        this.getAllArticle(this.categorieId);
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de la vente de l'article", error);
      }
    )
  }

  RavitaillerArticle(quantite:number, prix:number, articleId:number){
    this.ravitaillementService.addRavitaillementByArticleId(quantite, prix ,articleId).subscribe(
      (value) => {
        this.showAlert1('Article Ravitaillé', 'success');
        this.getAllArticle(this.categorieId);
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de la Ravitailler de l'article", error);
      }
    )
  }
    
  showAlert1(text:string, icon:any) {
    Swal.fire({
      title: text,
      icon: icon,
      timer: 1500,
      showConfirmButton: false
    });
  }

  comfirmSup(article:Article) {
  Swal.fire({
    title: 'Etes vous sur de supprimer?',
    text: article.libelle,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, Supprimer',
    cancelButtonText: 'Non, annuler!',
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true // sinon bootstrap ne prend pas
  }).then((result) => {
    if (result.isConfirmed) {
      // Action si confirmé
      this.supArticle(article);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Action si annulé
      Swal.fire({
        title: 'Suppression Annulé',
        text: 'Your file is safe!',
        icon: 'info',
        customClass: {
          confirmButton: 'btn btn-info'
        },
        buttonsStyling: false
      });
    }
  });
}

Vendre(article:Article) {
  Swal.fire({
    title: "Vendre l'article : " + article.libelle,
    html: '<input type="number" id="input-quantite" class="form-control mb-2" placeholder="Quantité">' +
          '<input type="number" id="input-prix" class="form-control" placeholder="Prix Total">',
    showCancelButton: true,
    confirmButtonText: 'Valider',
    cancelButtonText: 'Annuler',
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true,
    didOpen: () => {
      const inputQuantite = document.getElementById('input-quantite') as HTMLInputElement;
      const inputPrix = document.getElementById('input-prix') as HTMLInputElement;

      // Quand l’utilisateur tape une quantité → prix total mis à jour automatiquement
      inputQuantite.addEventListener('input', () => {
        const qte = Number(inputQuantite.value);
        if (!isNaN(qte) && qte > 0) {
          inputPrix.value = String(article.prix * qte);
        } else {
          inputPrix.value = '';
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const quantite = Number((document.getElementById('input-quantite') as HTMLInputElement).value);
      const prixTotal = Number((document.getElementById('input-prix') as HTMLInputElement).value);
      if (!isNaN(quantite) && quantite > 0) {
        this.vendreArticle(quantite, prixTotal, article.id);
      } else {
        this.showAlert1('Quantité invalide', 'error');
      }
    }
  });
}

Crediter(article:Article) {
  Swal.fire({
    title: "Vendre l'article à credit : " + article.libelle,
    html: `<select id="client" class="form-control mb-2">
            ${this.tableauClient.map(client => `<option value="${client.id}">${client.nom}</option>`).join('')}
          </select>` +
          '<input type="number" id="input-quantite" class="form-control mb-2" placeholder="Quantité">' +
          '<input type="number" id="input-prix" class="form-control" placeholder="Prix Total">',
    showCancelButton: true,
    confirmButtonText: 'Valider',
    cancelButtonText: 'Annuler',
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true,
    didOpen: () => {
      const inputQuantite = document.getElementById('input-quantite') as HTMLInputElement;
      const inputPrix = document.getElementById('input-prix') as HTMLInputElement;
      

      // Quand l’utilisateur tape une quantité → prix total mis à jour automatiquement
      inputQuantite.addEventListener('input', () => {
        const qte = Number(inputQuantite.value);
        if (!isNaN(qte) && qte > 0) {
          inputPrix.value = String(article.prix * qte);
        } else {
          inputPrix.value = '';
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const quantite = Number((document.getElementById('input-quantite') as HTMLInputElement).value);
      const prixTotal = Number((document.getElementById('input-prix') as HTMLInputElement).value);
      const clientId = Number((document.getElementById('client') as HTMLSelectElement).value);
      if (!isNaN(quantite) && quantite > 0) {
        this.crediterArticle(quantite, prixTotal, article.id, clientId);
      } else {
        this.showAlert1('Quantité invalide', 'error');
      }
    }
  });
}

Ravitailler(article:Article) {
  Swal.fire({
    title: "Ravitailler l'article : " + article.libelle,
    html: '<input type="number" id="input-quantite" class="form-control mb-2" placeholder="Quantité">' +
          '<input type="number" id="input-prix" class="form-control" placeholder="Prix Total">',
    showCancelButton: true,
    confirmButtonText: 'Valider',
    cancelButtonText: 'Annuler',
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true
  }).then((result) => {
    if (result.isConfirmed) {
      const quantite = Number((document.getElementById('input-quantite') as HTMLInputElement).value);
      const prixTotal = Number((document.getElementById('input-prix') as HTMLInputElement).value);
      if (!isNaN(quantite) && quantite > 0) {
        this.RavitaillerArticle(quantite, prixTotal, article.id);
      } else {
        this.showAlert1('Quantité invalide', 'error');
      }
    }
  });
}

}
