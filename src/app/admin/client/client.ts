import { AfterViewInit, Component } from '@angular/core';
import { Client } from '../../models/client';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client';
import Swal from 'sweetalert2';
import { ArticleService } from '../../services/article';
import { Article } from '../../models/article';
import 'datatables.net';
import { Categorie } from '../../models/categorie';
import { PaiementService } from '../../services/paiement';
import { CategorieService } from '../../services/categorie';
import { CreditService } from '../../services/credit';
import { ClientProjection } from '../../models/client-projection';
declare var $: any;


@Component({
  selector: 'app-client',
  imports: [FormsModule, CommonModule],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class ClientComponent implements AfterViewInit{

  page='liste';
  clientAjout : Client = new Client();
  clientModif : Client = new Client();
  tableauClient : ClientProjection[] = [];
  tableauCategorie : Categorie[] = [];
  tableauArticle : Article[] = [];
  dateStart !: string;
  dateEnd !: string;

  constructor( private clientService : ClientService, private articleService : ArticleService,private categorieService : CategorieService
    ,private paiementService : PaiementService, private creditService : CreditService) {  }

  ngOnInit() : void{
    const today = new Date();
    this.dateEnd = today.toISOString().split('T')[0];
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    this.dateStart = oneWeekAgo.toISOString().split('T')[0]; // Par défaut, une semaine avant

    this.getAllClient();
    this.getAllCategorie();
  
  }

  ngAfterViewInit(): void {
    // Rien ici, l'init se fera après chargement des données
  }

  pageListe(){
    this.page = 'liste';
  }

  pageAjout(){
    this.page = 'ajout';
  }

  pageModif(client : Client){
    this.clientModif = client;
    this.page = 'modif';
  }


  getAllClient(){ {
    const table = $('#basic-datatables').DataTable();
  if (table) {
    table.destroy();
  }
    this.clientService.getAllClientBySolde(this.dateStart, this.dateEnd).subscribe(
      (value: Array<ClientProjection>) => {
      this.tableauClient = value;
      setTimeout(() => $('#basic-datatables').DataTable(), 400);

      },
      (error) => {
        console.log("Erreur lors de la récupération des clients", error);
      }
    )
  }
}


getAllCategorie(){ {
    this.categorieService.getAllCategorie().subscribe(
      (value: Array<Categorie>) => {
        this.tableauCategorie = value;
      },
      (error) => {
        console.log("Erreur lors de la récupération des categories", error);
      }
    )
  }
}

getAllArticle(id: number){ 
    this.articleService.getAllArticle(id).subscribe(
      (value: Array<Article>) => {
        this.tableauArticle = value;
      },
      (error) => {
        console.log("Erreur lors de la récupération des articles", error);
      }
    )
  }


  addClient(){
    this.clientService.saveClient(this.clientAjout).subscribe(
      (value) => {
        this.showAlert1('Client enregistré', 'success');
        this.getAllClient();
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de l'enregistrement de la client", error);
      }
    )
  }

  PayerClient(clientId:number, montant:number){
    this.paiementService.addPaiementByClientId(montant, clientId).subscribe(
      (value) => {

        this.getAllClient();

        this.showAlert1('Paiement enregistré', 'success');
        
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de l'enregistrement du paiement", error);
      }
    )
   
  }

  crediterClient(articleId:number, quantite:number, prix:number, clientId:number){
    this.creditService.addCreditByArticleId(quantite, prix, articleId, clientId).subscribe(
      (value) => {
        this.showAlert1('Crédit enregistré', 'success');
        this.getAllClient();
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de l'enregistrement du crédit", error);
      }
    )
  }


  supClient(client:Client) {
    this.clientService.deleteClient(client.id!).subscribe(
      (value) => {
        this.showAlert1('Client supprimé', 'success');
        this.getAllClient();
      },
      (error) => {
        console.log("Erreur lors de la suppression de la client", error);
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

  comfirmSup(client:Client) {
  Swal.fire({
    title: 'Etes vous sur de supprimer?',
    text: client.nom,
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
      this.supClient(client);
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

Payer(id: number, nom: string){ {
  Swal.fire({
    title: "Paiement pour le client: " + nom,
    html: '<input type="number" id="montant" class="form-control" placeholder="Montant">',
    showCancelButton: true,
    confirmButtonText: 'Valider',
    cancelButtonText: 'Annuler',
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true,
  }).then((result) => {
    if (result.isConfirmed) {
      const montant = Number((document.getElementById('montant') as HTMLInputElement).value);
      if (!isNaN(montant) && montant > 0) {
        this.PayerClient(id, montant);
      } else {
        this.showAlert1('Quantité invalide', 'error');
      }
    }
  });
}
}

Crediter(id: number,nom: string){ {
  Swal.fire({
    title: "Payer à credit pour le client: " + nom,
    html: `<select id="categorie" class="form-control mb-2">
            ${this.tableauCategorie.map(categorie => `<option value="${categorie.id}">${categorie.libelle}</option>`).join('')}
          </select>` +
          '<select id="article" class="form-control mb-2">' +
            `${this.tableauArticle.map(article => `<option value="${article}">${article.libelle}</option>`).join('')}` +
          '</select>' +
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
      const categorieSelect = document.getElementById('categorie') as HTMLSelectElement;
      categorieSelect.addEventListener('change', (event) => {
        const selectedCategorieId = (event.target as HTMLSelectElement).value;
        this.articleService.getAllArticle(Number(selectedCategorieId)).subscribe(
        (articles: Article[]) => {
          remplirArticles(articles);
        }
      );
      });
      const quantiteInput = document.getElementById('input-quantite') as HTMLInputElement;
      const prixInput = document.getElementById('input-prix') as HTMLInputElement;
      const articleSelect = document.getElementById('article') as HTMLSelectElement;
      const remplirArticles = (articles: Article[]) => {
        articleSelect.innerHTML = articles.map(a => 
          `<option value='${JSON.stringify(a)}'>${a.libelle}</option>`
        ).join('');
      };

      // Initialiser avec la première catégorie
      this.articleService.getAllArticle(Number(categorieSelect.value)).subscribe(
        (articles: Article[]) => {
          remplirArticles(articles);
        }
      );
      quantiteInput.addEventListener('input', () => {
        const quantite = Number(quantiteInput.value);
        const prixUnitaire = articleSelect.value ? (JSON.parse(articleSelect.value) as Article).prix : 0;
        if (!isNaN(quantite) && quantite > 0) {
          prixInput.value = String(quantite * prixUnitaire);
        } else {
          prixInput.value = '';
        }
    });
    articleSelect.addEventListener('change', () => {
        const quantite = Number(quantiteInput.value);
        const prixUnitaire = articleSelect.value ? (JSON.parse(articleSelect.value) as Article).prix : 0;
        if (!isNaN(quantite) && quantite > 0) {
          prixInput.value = String(quantite * prixUnitaire);
        } else {
          prixInput.value = '';
        }
      }
  );
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const montant = Number((document.getElementById('input-prix') as HTMLInputElement).value);
      if (!isNaN(montant) && montant > 0) {
        this.crediterClient((document.getElementById('article') as HTMLSelectElement).value ? (JSON.parse((document.getElementById('article') as HTMLSelectElement).value) as Article).id : 0,
        Number((document.getElementById('input-quantite') as HTMLInputElement).value),
        Number((document.getElementById('input-prix') as HTMLInputElement).value),
        id);
      } else {
        this.showAlert1('Quantité invalide', 'error');
      }
    }
  });
}
}

}

