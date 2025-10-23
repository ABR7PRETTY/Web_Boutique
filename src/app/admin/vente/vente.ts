import { AfterViewInit, Component } from '@angular/core';
import { Vente } from '../../models/vente';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VenteService } from '../../services/vente';
import Swal from 'sweetalert2';
import { ArticleService } from '../../services/article';
import { Article } from '../../models/article';
import 'datatables.net';
import { Categorie } from '../../models/categorie';
import { CategorieService } from '../../services/categorie';
import { constantes } from '../../constantes';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;


@Component({
  selector: 'app-vente',
  imports: [FormsModule, CommonModule],
  templateUrl: './vente.html',
  styleUrl: './vente.css'
})
export class VenteComponent implements AfterViewInit{

  page='liste';
  venteAjout : Vente = new Vente();
  venteModif : Vente = new Vente();
  tableauVente : Vente[] = [];
  tableauArticle : Article[] = [];
  tableauCategorie : Categorie[] = [];
  currentArticle : Article = new Article();
  currentCategorie : Categorie= new Categorie();
  dateStart !: string;
  dateEnd !: string;


  constructor( private venteService : VenteService, private articleService : ArticleService,private categorieService : CategorieService,private sanitizer: DomSanitizer) {  }

  ngOnInit() : void{

    const today = new Date();
    this.dateEnd = today.toISOString().split('T')[0];
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    this.dateStart = oneWeekAgo.toISOString().split('T')[0]; // Par défaut, une semaine avant

    this.getAllArticles();
    this.getAllCategorie();
    this.getAllVente();
  
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

  pageModif(vente : Vente){
    this.venteModif = vente;
    this.page = 'modif';
  }


  getAllVente() {
    const table = $('#basic-datatables').DataTable();
  if (table) {
    table.destroy();
  }
    this.venteService.getAllVenteByDate(this.dateStart, this.dateEnd).subscribe(
      (value: Array<Vente>) => {
        this.tableauVente = value.map(vente => {
          return {
            ...vente,
            article: {
              ...vente.article,
              imageUrl: this.sanitizer.bypassSecurityTrustUrl(
                constantes.apiUrl + vente.article.imageUrl
              )
            }
          };
        });

        setTimeout(() => $('#basic-datatables').DataTable(), 400);

      },
      (error) => {
        console.log("Erreur lors de la récupération des ventes", error);
      }
    )
  }

  getAllCategorie() {
    this.categorieService.getAllCategorie().subscribe(
      (value: Array<Categorie>) => {
        this.tableauCategorie = value;

      },
      (error) => {
        console.log("Erreur lors de la récupération des categories", error);
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


  addVente(){
    this.venteService.saveVente(this.venteAjout).subscribe(
      (value) => {
        this.showAlert1('Vente enregistré', 'success');
        this.getAllVente();
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de l'enregistrement de la vente", error);
      }
    )
  }

  supVente(vente:Vente) {
    this.venteService.deleteVente(vente.id!).subscribe(
      (value) => {
        this.showAlert1('Vente supprimé', 'success');
        this.getAllVente();
      },
      (error) => {
        console.log("Erreur lors de la suppression de la vente", error);
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

  comfirmSup(vente:Vente) {
  Swal.fire({
    title: 'Etes vous sur de supprimer?',
    text: vente.article.libelle,
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
      this.supVente(vente);
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
