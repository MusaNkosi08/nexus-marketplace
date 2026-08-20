import { Component, Injectable } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterOutlet } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

const API = "http://localhost:3000/api";

type Product = { id: number; brand: string; name: string; slug?: string; description: string; priceZar: string; stock: number; imageUrl: string; collectionId?: number; categoryId?: number };

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}
  items() { return this.http.get<{ items: Product[] }>(`${API}/items`); }
  item(id: string) { return this.http.get<{ item: Product }>(`${API}/items/${id}`); }
  createItem(payload: Partial<Product>) { return this.http.post(`${API}/items`, payload); }
  updateItem(id: number, payload: Partial<Product>) { return this.http.put(`${API}/items/${id}`, payload); }
  deleteItem(id: number) { return this.http.delete(`${API}/items/${id}`); }
}

@Component({ selector: "app-root", standalone: true, imports: [CommonModule, RouterOutlet, RouterLink], template: `<nav class="navbar navbar-dark" style="background:#1B2632"><div class="container"><a class="navbar-brand fw-bold" routerLink="/">NEXUS</a><div class="d-flex gap-3"><a class="text-light text-decoration-none" routerLink="/items">ITEMS</a><a class="text-light text-decoration-none" routerLink="/cart">CART</a><a class="text-light text-decoration-none" routerLink="/admin">ADMIN</a></div></div></nav><main class="container py-5"><router-outlet /></main>` })
export class AppComponent {}

@Component({ standalone: true, imports: [CommonModule, RouterLink], template: `<section class="p-5 rounded-4" style="background:#EEE9DF"><p class="text-uppercase small" style="color:#A35139">NEXUS / ANGULAR WEB</p><h1 class="display-2 fw-bold" style="color:#1B2632">Technology,<br><em>intelligently</em><br>curated.</h1><p class="lead" style="color:#2C3B4D">A rubric-aligned Angular companion for the NEXUS technology marketplace.</p><a class="btn btn-dark me-2" routerLink="/items">Browse items</a><a class="btn btn-outline-dark" routerLink="/admin">Open admin</a></section>` })
export class HomePageComponent {}

@Component({ standalone: true, imports: [CommonModule, RouterLink], template: `<h1>Item List</h1><div class="row g-4"><div class="col-md-4" *ngFor="let item of items"><article class="card h-100"><img [src]="item.imageUrl" class="card-img-top" [alt]="item.name"><div class="card-body"><small>{{item.brand}}</small><h2 class="h5">{{item.name}}</h2><p>R {{item.priceZar}}</p><a class="btn btn-sm btn-outline-dark" [routerLink]="['/items', item.id]">View detail</a></div></article></div></div>` })
export class ItemListPageComponent { items: Product[] = []; constructor(api: ApiService) { api.items().subscribe(result => this.items = result.items); } }

@Component({ standalone: true, imports: [CommonModule, RouterLink], template: `<ng-container *ngIf="item"><a routerLink="/items">← Back to items</a><div class="row mt-4"><div class="col-md-6"><img [src]="item.imageUrl" class="img-fluid rounded" [alt]="item.name"></div><div class="col-md-6"><p class="text-uppercase" style="color:#A35139">{{item.brand}}</p><h1>{{item.name}}</h1><p>{{item.description}}</p><h2>R {{item.priceZar}}</h2><button class="btn btn-dark" (click)="add()">ADD TO CART</button><p class="mt-3">{{item.stock}} in stock</p></div></div></ng-container>` })
export class ItemDetailPageComponent { item?: Product; constructor(api: ApiService) { const id = location.pathname.split("/").pop() ?? "1"; api.item(id).subscribe(result => this.item = result.item); } add() { localStorage.setItem("nexus-cart", JSON.stringify([{ id: this.item?.id, name: this.item?.name, price: this.item?.priceZar, quantity: 1 }])); } }

@Component({ standalone: true, imports: [CommonModule], template: `<h1>Cart</h1><div class="alert alert-light border"><p class="mb-1">Cart items are stored locally for the Angular companion.</p><strong>Subtotal: R {{subtotal}}</strong></div><button class="btn btn-dark">SIMULATE CHECKOUT</button>` })
export class CartPageComponent { subtotal = "0.00"; constructor() { const lines = JSON.parse(localStorage.getItem("nexus-cart") ?? "[]"); this.subtotal = lines.reduce((sum: number, line: { price: string; quantity: number }) => sum + Number(line.price) * line.quantity, 0).toFixed(2); } }

@Component({ standalone: true, imports: [CommonModule, FormsModule], template: `<h1>Admin Panel</h1><p class="text-muted">JWT-authenticated admin actions are provided by the shared Express API.</p><form class="row g-3 mb-4" #form="ngForm" (ngSubmit)="create()"><div class="col-md-4"><input class="form-control" name="brand" [(ngModel)]="draft.brand" required placeholder="Brand"></div><div class="col-md-4"><input class="form-control" name="name" [(ngModel)]="draft.name" required placeholder="Product name"></div><div class="col-md-2"><input class="form-control" name="priceZar" [(ngModel)]="draft.priceZar" required type="number" min="0" placeholder="ZAR price"></div><div class="col-md-2"><button class="btn btn-dark w-100" [disabled]="form.invalid">ADD</button></div></form><div class="table-responsive"><table class="table"><thead><tr><th>Brand</th><th>Name</th><th>Price</th><th>Stock</th><th></th></tr></thead><tbody><tr *ngFor="let item of items"><td>{{item.brand}}</td><td>{{item.name}}</td><td>R {{item.priceZar}}</td><td><input class="form-control" type="number" min="0" [ngModel]="item.stock" (ngModelChange)="update(item, $event)"></td><td><button class="btn btn-sm btn-outline-danger" (click)="remove(item.id)">Delete</button></td></tr></tbody></table></div>` })
export class AdminPageComponent { items: Product[] = []; draft: Partial<Product> = {}; constructor(private api: ApiService) { this.load(); } load() { this.api.items().subscribe(result => this.items = result.items); } create() { this.api.createItem({ ...this.draft, slug: `${this.draft.name ?? "item"}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"), description: this.draft.name ?? "NEXUS item", imageUrl: "/manus-storage/macbook-air_169c651b.jpg", collectionId: 1, categoryId: 1, stock: 0 }).subscribe(() => { this.draft = {}; this.load(); }); } update(item: Product, stock: number) { this.api.updateItem(item.id, { stock }).subscribe(() => item.stock = stock); } remove(id: number) { this.api.deleteItem(id).subscribe(() => this.load()); } }
