import { Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { CategorieComponent } from './admin/categorie/categorie';
import { ArticleComponent } from './admin/article/article';
import { RavitaillementComponent } from './admin/ravitaillement/ravitaillement';
import { VenteComponent } from './admin/vente/vente';
import { ClientComponent } from './admin/client/client';
import { CreditComponent } from './admin/credit/credit';
import { PaiementComponent } from './admin/paiement/paiement';
import { RapportComponent } from './admin/rapport/rapport';

export const routes: Routes = [
    { path: 'admin', component: Admin,
        children: [
            { path: 'categorie', component: CategorieComponent},
            { path: 'vente', component: VenteComponent},
            { path: 'ravitaillement', component: RavitaillementComponent},
            { path: 'article/:id', component: ArticleComponent },
            { path: 'client', component: ClientComponent},
            { path: 'paiement', component: PaiementComponent},
            { path: 'credit', component: CreditComponent},
            { path: 'rapport', component: RapportComponent},
            { path: '', redirectTo: 'categorie', pathMatch: 'full' }
        ]
    },

    { path: '', redirectTo: 'admin', pathMatch: 'full' },
   
];
