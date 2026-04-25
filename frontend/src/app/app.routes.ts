import { Routes } from '@angular/router';
import { ConditionSearchComponent } from './components/condition-search/condition-search.component';
import { ConditionDetailComponent } from './components/condition-detail/condition-detail.component';
import { DrugInfoComponent } from './components/drug-info/drug-info.component';
import { LandingComponent } from './components/landing/landing.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'sintomas', component: ConditionSearchComponent },
  { path: 'landing', redirectTo: '', pathMatch: 'full' },
  { path: 'detail/:icdCode', component: ConditionDetailComponent },
  { path: 'drugs', component: DrugInfoComponent },
  { path: 'favoritos', component: FavoritesComponent },
  { path: '**', redirectTo: '' }
];
