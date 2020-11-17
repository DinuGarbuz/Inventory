import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './menu-items/inventory/inventory.component';
import { ScanComponent } from './menu-items/scan/scan.component';
import { AddItemComponent } from './menu-items/add-item/add-item.component';
import { ContactComponent } from './menu-items/contact/contact.component';
import { HomePageComponent } from './home-page/home-page.component';
import {ShowItemComponent} from './menu-items/show-item/show-item.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'scan', component: ScanComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: 'edit/:id', component: AddItemComponent },
  { path: 'item/:id', component: ShowItemComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'show-item', component: ShowItemComponent },
  { path: 'print', outlet: 'print', component: PrintLayoutComponent, children: [
    { path: 'invoice', component: InvoiceComponent }
  ]},
{ path: 'invoice/:invoiceIds', component: InvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const RoutingComponent = [
  HomePageComponent,
  InventoryComponent,
  ScanComponent,
  AddItemComponent,
  ContactComponent,
  ShowItemComponent,
];

