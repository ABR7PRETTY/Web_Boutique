import { AfterViewInit, Component } from '@angular/core';
import { Ravitaillement } from '../../models/ravitaillement';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RavitaillementService } from '../../services/ravitaillement';
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
  selector: 'app-ravitaillement',
  imports: [FormsModule, CommonModule],
  templateUrl: './ravitaillement.html',
  styleUrl: './ravitaillement.css'
})
export class RavitaillementComponent implements AfterViewInit{

  page='liste';
  ravitaillementAjout : Ravitaillement = new Ravitaillement();
  ravitaillementModif : Ravitaillement = new Ravitaillement();
  tableauRavitaillement : Ravitaillement[] = [];
  tableauArticle : Article[] = [];
  tableauCategorie : Categorie[] = [];
  currentArticle : Article = new Article();
  currentCategorie : Categorie= new Categorie();
  dateStart !: string;
  dateEnd !: string;


  constructor( private ravitaillementService : RavitaillementService, private articleService : ArticleService,private categorieService : CategorieService,private sanitizer: DomSanitizer) {  }

  ngOnInit() : void{

    const today = new Date();
    this.dateEnd = today.toISOString().split('T')[0];
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    this.dateStart = oneWeekAgo.toISOString().split('T')[0]; // Par défaut, une semaine avant

    this.getAllArticles();
    this.getAllCategorie();
    this.getAllRavitaillement();
  
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

  pageModif(ravitaillement : Ravitaillement){
    this.ravitaillementModif = ravitaillement;
    this.page = 'modif';
  }


  getAllRavitaillement() {
    const table = $('#basic-datatables').DataTable();
  if (table) {
    table.destroy();
  }
    this.ravitaillementService.getAllRavitaillementByDate(this.dateStart, this.dateEnd).subscribe(
      (value: Array<Ravitaillement>) => {
        this.tableauRavitaillement = value.map(ravitaillement => {
          return {
            ...ravitaillement,
            article: {
              ...ravitaillement.article,
              imageUrl: this.sanitizer.bypassSecurityTrustUrl(
                constantes.apiUrl + ravitaillement.article.imageUrl
              )
            }
          };
        });

        setTimeout(() => $('#basic-datatables').DataTable(), 400);

      },
      (error) => {
        console.log("Erreur lors de la récupération des ravitaillements", error);
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


  addRavitaillement(){
    this.ravitaillementService.saveRavitaillement(this.ravitaillementAjout).subscribe(
      (value) => {
        this.showAlert1('Ravitaillement enregistré', 'success');
        this.getAllRavitaillement();
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de l'enregistrement de la ravitaillement", error);
      }
    )
  }

  supRavitaillement(ravitaillement:Ravitaillement) {
    this.ravitaillementService.deleteRavitaillement(ravitaillement.id!).subscribe(
      (value) => {
        this.showAlert1('Ravitaillement supprimé', 'success');
        this.getAllRavitaillement();
      },
      (error) => {
        console.log("Erreur lors de la suppression de la ravitaillement", error);
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

  comfirmSup(ravitaillement:Ravitaillement) {
  Swal.fire({
    title: 'Etes vous sur de supprimer?',
    text: ravitaillement.article.libelle,
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
    this.supRavitaillement(ravitaillement);
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
