import { Routes } from '@angular/router';
import { HomeComponent } from './files/home/home.component';
import { CreateComponent } from './files/create/create.component';
import { ViewComponent } from './files/view/view.component';
import { DisplaybudgetComponent } from './files/displaybudget/displaybudget.component';
import { ViewItemComponent } from './files/view-item/view-item.component';
import { NavbarComponent } from './files/navbar/navbar.component';
import { FooterComponent } from './files/footer/footer.component';

export const routes: Routes = [

    {path: "" , pathMatch: "full", redirectTo: "Home"},
    // {path: "**" ,redirectTo:"Home" },
    {path: "navbar", component:NavbarComponent},
    {path: "Home", component: HomeComponent },
    {path: "create", component: CreateComponent },
    {path: "view", component: ViewComponent},
    {path: "display/:id", component: DisplaybudgetComponent},
    {path : "viewItem/:id" , component: ViewItemComponent},
     {path: "footer",component:FooterComponent},
     


];
