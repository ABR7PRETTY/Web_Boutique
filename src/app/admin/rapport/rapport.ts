import { AfterViewInit, Component } from '@angular/core';
import { ArticleService } from '../../services/article';
import { Rapport } from '../../models/rapport';
import { FormsModule } from '@angular/forms';
import 'datatables.net';
declare var $: any;

@Component({
  selector: 'app-rapport',
  imports: [FormsModule],
  templateUrl: './rapport.html',
  styleUrl: './rapport.css'
})
export class RapportComponent implements AfterViewInit{

  tableauRapport : Rapport[] = [];
  dateStart !: string;
  dateEnd !: string;

  constructor( private articleService : ArticleService) {  }

  ngOnInit() : void{
    const today = new Date();
    this.dateEnd = today.toISOString().split('T')[0];
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    this.dateStart = oneWeekAgo.toISOString().split('T')[0]; // Par défaut, une semaine avant
    this.getRapport();
  }

  ngAfterViewInit(): void {
    // Rien ici, l'init se fera après chargement des données
  }

  getRapport(){
    const table = $('#basic-datatables').DataTable();
  if (table) {
    table.destroy();
  }
    this.articleService.getRapport(this.dateStart,this.dateEnd).subscribe(data=>{
      this.tableauRapport = data;
      setTimeout(() => $('#basic-datatables').DataTable(), 400);
    },
   (error) => {
        console.log("Erreur lors du rapport", error);
      }
    );
  }

}
