import { Routes } from '@angular/router';
import { ConditionSearchComponent } from './components/condition-search/condition-search.component';
import { ConditionDetailComponent } from './components/condition-detail/condition-detail.component';
import { DrugInfoComponent } from './components/drug-info/drug-info.component';

export const routes: Routes = [
  { path: '', component: ConditionSearchComponent },
  { path: 'detail/:icdCode', component: ConditionDetailComponent },
  { path: 'drugs', component: DrugInfoComponent },
  { path: '**', redirectTo: '' }
];
