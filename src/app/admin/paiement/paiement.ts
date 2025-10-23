import { AfterViewInit, Component } from '@angular/core';
import { Paiement } from '../../models/paiement';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaiementService } from '../../services/paiement';
import Swal from 'sweetalert2';
import { ClientService } from '../../services/client';
import { Client } from '../../models/client';
import 'datatables.net';
import { Categorie } from '../../models/categorie';
import { CategorieService } from '../../services/categorie';
import { constantes } from '../../constantes';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;


@Component({
  selector: 'app-paiement',
  imports: [FormsModule, CommonModule],
  templateUrl: './paiement.html',
  styleUrl: './paiement.css'
})
export class PaiementComponent implements AfterViewInit{

  page='liste';
  paiementAjout : Paiement = new Paiement();
  paiementModif : Paiement = new Paiement();
  tableauPaiement : Paiement[] = [];
  tableauClient : Client[] = [];
  dateStart!: string;
  dateEnd !: string;


  constructor( private paiementService : PaiementService, private clientService : ClientService,private sanitizer: DomSanitizer) {  }

  ngOnInit() : void{

    const today = new Date();
    this.dateEnd = today.toISOString().split('T')[0];
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    this.dateStart = oneWeekAgo.toISOString().split('T')[0]; // Par défaut, une semaine avant

    this.getAllClients();
    this.getAllPaiement();
  
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

  pageModif(paiement : Paiement){
    this.paiementModif = paiement;
    this.page = 'modif';
  }


  getAllPaiement() {
    const table = $('#basic-datatables').DataTable();
  if (table) {
    table.destroy();
  }
    this.paiementService.getAllPaiementByDate(this.dateStart, this.dateEnd).subscribe(
      (value: Array<Paiement>) => {
        this.tableauPaiement = value

        setTimeout(() => $('#basic-datatables').DataTable(), 400);

      },
      (error) => {
        console.log("Erreur lors de la récupération des paiements", error);
      }
    )
  }


  getAllClients() {
    this.clientService.getAllClient().subscribe(
      (value: Array<Client>) => {
        this.tableauClient = value;

      },
      (error) => {
        console.log("Erreur lors de la récupération des clients", error);
      }
    )
  }


  addPaiement(){
    this.paiementService.savePaiement(this.paiementAjout).subscribe(
      (value) => {
        this.showAlert1('Paiement enregistré', 'success');
        this.getAllPaiement();
        this.pageListe();
      },
      (error) => {
        console.log("Erreur lors de l'enregistrement de la paiement", error);
      }
    )
  }

  supPaiement(paiement:Paiement) {
    this.paiementService.deletePaiement(paiement.id!).subscribe(
      (value) => {
        this.showAlert1('Paiement supprimé', 'success');
        this.getAllPaiement();
      },
      (error) => {
        console.log("Erreur lors de la suppression de la paiement", error);
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

  comfirmSup(paiement:Paiement) {
  Swal.fire({
    title: 'Etes vous sur de supprimer?',
    text: paiement.client.nom+" : "+paiement.montant,
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
      this.supPaiement(paiement);
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
