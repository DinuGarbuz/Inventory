import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, RoutingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
  
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import {QRCodeModule} from 'angularx-qrcode';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import { ShowItemComponent } from './menu-items/show-item/show-item.component';
import {MatIconModule} from '@angular/material/icon';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { InvoiceComponent } from './invoice/invoice.component';


@NgModule({
  declarations: [AppComponent, RoutingComponent, ShowItemComponent, MatConfirmDialogComponent, PrintLayoutComponent, InvoiceComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatToolbarModule,
    QRCodeModule,
    ZXingScannerModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
