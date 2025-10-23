import { AfterViewInit, Component } from '@angular/core';
import { Credit } from '../../models/credit';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreditService } from '../../services/credit';
import Swal from 'sweetalert2';
import { ArticleService } from '../../services/article';
import { CategorieService } from '../../services/categorie';
import { Article } from '../../models/article';
import 'datatables.net';
import { Client } from '../../models/client';
import { Categorie } from '../../models/categorie';
import { ClientService } from '../../services/client';
import { constantes } from '../../constantes';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;


@Component({
  selector: 'app-credit',
  imports: [FormsModule, CommonModule],
  templateUrl: './credit.html',
  styleUrl: './credit.css'
})
export class CreditComponent implements AfterViewInit{

  page='liste';
  creditAjout : Credit = new Credit();
  creditModif : Credit = new Credit();
  tableauCredit : Credit[] = [];
  tableauArticle : Article[] = [];
  tableauClient : Client[] = [];
  tableauCategorie : Categorie[] = [];
  currentArticle : Article = new Article();
  currentCategorie : Categorie= new Categorie();
  dateStart !: string;
  dateEnd !: string;


  constructor( private creditService : CreditService, private articleService : ArticleService,private clientService : ClientService,
    private categorieService : CategorieService,private sanitizer: DomSanitizer) {  }

  ngOnInit() : void{

    const today = new Date();
    this.dateEnd = today.toISOString().split('T')[0];
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    this.dateStart = oneWeekAgo.toISOString().split('T')[0]; // Par défaut, une semaine avant

    this.getAllCategories();
    this.getAllClient();
    this.getAllCredit();
  
  }

  ngAfterViewInit(): void {
    // Rien ici, l'init se fera après chargement des données
  }

  pageListe(){
    this.creditAjout = new Credit();
    this.page = 'liste';
  }

  pageAjout(){
    this.page = 'ajout';
  }

  pageModif(credit : Credit){
    this.creditModif = credit;
    this.page = 'modif';
  }


  getAllCredit() {
    const table = $('#basic-datatables').DataTable();
  if (table) {
    table.destroy();
  }
    this.creditService.getAllCreditByDate(this.dateStart, this.dateEnd).subscribe(
      (value: Array<Credit>) => {
        this.tableauCredit = value.map(credit => {
          return {
            ...credit,
            article: {
              ...credit.article,
              imageUrl: this.sanitizer.bypassSecurityTrustUrl(
                constantes.apiUrl + credit.article.imageUrl
              )
            }
          };
        });

        setTimeout(() => $('#basic-datatables').DataTable(), 400);

      },
      (error) => {
        console.log("Erreur lors de la récupération des credits", error);
      }
    )
  }

  getAllClient() {
    this.clientService.getAllClient().subscribe(
      (value: Array<Client>) => {
        this.tableauClient = value;

      },
      (error) => {
        console.log("Erreur lors de la récupération des clients", error);
      }
    )
  }


  getAllArticles() {
    this.articleService.getAllArticle(this.currentCategorie.id).subscribe(
      (value: Array<Article>) => {
        this.tableauArticle = value;

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


  addCredit(){
    this.creditService.saveCredit(this.creditAjout).subscribe(
      (value) => {
        this.showAlert1('Credit enregistré', 'success');
        this.getAllCredit();
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de l'enregistrement de la credit", error);
      }
    )
  }

  supCredit(credit:Credit) {
    this.creditService.deleteCredit(credit.id!).subscribe(
      (value) => {
        this.showAlert1('Credit supprimé', 'success');
        this.getAllCredit();
      },
      (error) => {
        console.log("Erreur lors de la suppression de la credit", error);
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

  comfirmSup(credit:Credit) {
  Swal.fire({
    title: 'Etes vous sur de supprimer?',
    text: credit.article.libelle,
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
      this.supCredit(credit);
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


}
