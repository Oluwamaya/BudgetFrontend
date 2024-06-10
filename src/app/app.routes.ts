import { Routes } from '@angular/router';
import { HomeComponent } from './files/home/home.component';
import { CreateComponent } from './files/create/create.component';
import { ViewComponent } from './files/view/view.component';
import { DisplaybudgetComponent } from './files/displaybudget/displaybudget.component';

export const routes: Routes = [

    {path: "" , pathMatch: "full", redirectTo: "Home"},
    {path: "Home", component: HomeComponent },
    {path: "create", component: CreateComponent },
    {path: "view", component: ViewComponent},
    {path: "view/display/:id", component: DisplaybudgetComponent}

];
