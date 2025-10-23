import { Component } from '@angular/core';
import { Categorie } from '../../models/categorie';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategorieService } from '../../services/categorie';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { constantes } from '../../constantes';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-categorie',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './categorie.html',
  styleUrl: './categorie.css'
})
export class CategorieComponent {

  page='liste';
  categorieAjout : Categorie = new Categorie();
  tableauCategorie : Categorie[] = [];

  constructor( private categorieService : CategorieService, private router: Router,private sanitizer: DomSanitizer) {  }

  ngOnInit() : void{
    this.getAllcategorie();
  }

  pageListe(){
    this.page = 'liste';
  }

  pageAjout(){
    this.page = 'ajout';
    this.categorieAjout = new Categorie();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.categorieAjout.image = file;
  }


  getAllcategorie(){
    this.categorieService.getAllCategorie().subscribe(
      (value: Array<Categorie>) => {
        
        this.tableauCategorie = value.map(categorie => {
              return {
                ...categorie,
                imageUrl: this.sanitizer.bypassSecurityTrustStyle(`url(${constantes.apiUrl + categorie.imageUrl})`)
              };});
        
              console.log(this.tableauCategorie);
      },
      (error) => {
        console.log("Erreur lors de la récupération des categories", error);
      }
    )
  }

  addCategorie(){
    this.categorieService.saveCategorie(this.categorieAjout).subscribe(
      (value) => {
        this.showAlert1('Categorie enregistré', 'success');
        this.getAllcategorie();
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de l'enregistrement de la categorie", error);
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

  comfirmSup(categorie:Categorie) {
  Swal.fire({
    title: 'Etes vous sur de supprimer?',
    text: categorie.libelle,
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
      // this.supCategorie(categorie);
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

goToArticles(categorieId: number) {
    const url = ['/article', categorieId];
    console.log('URL générée:', url);
    this.router.navigate(url);
  }

}
