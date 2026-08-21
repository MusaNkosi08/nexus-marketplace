import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, Routes } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { AppComponent } from "./app/app.component";
import { HomePageComponent, ItemListPageComponent, ItemDetailPageComponent, CartPageComponent, AdminPageComponent } from "./app/pages";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "items", component: ItemListPageComponent },
  { path: "items/:id", component: ItemDetailPageComponent },
  { path: "cart", component: CartPageComponent },
  { path: "admin", component: AdminPageComponent },
  { path: "**", redirectTo: "" },
];

bootstrapApplication(AppComponent, { providers: [provideRouter(routes), provideHttpClient()] }).catch(console.error);
