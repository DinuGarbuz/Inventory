import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

import {InventoryListService} from '../../app-logic/inventory-list.service';
import { InventoryItem } from '../../app-logic/inventory-item';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize, tap, switchMap } from 'rxjs/operators';
import { merge, BehaviorSubject } from 'rxjs';
import { DialogService } from 'src/app/dialog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PrintService} from 'src/app/print.service';



@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  inventoryItems: any;
  inventoryColumns: string[] = [
    'select',
    'id',
    'name',
    'description',
    'user',
    'location',
    'inventoryNumber',
    'createdAt',
    'modifiedAt',
    'active',
    'actions',
   
  ];
  selection = new SelectionModel<Element>(true, []);

  isLoading: boolean;
  activeOnly$ = new BehaviorSubject(false);
  itemsCount = 0;
  itemId: string;
  item: InventoryItem;
  printValue: string;

  get activeOnly(): boolean{
    return this.activeOnly$.value;
  }

  set activeOnly(v:boolean){
    this.activeOnly$.next(v);
  }

  constructor(
    private inventoryListService: InventoryListService,
    private route: Router,
    private dialogService: DialogService,
    private snackBar:MatSnackBar,
    public printService: PrintService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
 
        merge( this.sort.sortChange, this.activeOnly$)
        .subscribe(() => {
          this.paginator.pageIndex=0;
        });

        merge(this.paginator.page, this.sort.sortChange, this.activeOnly$)
        .subscribe(()=>{
          
        })

        merge(this.paginator.page, this.sort.sortChange, this.activeOnly$)
          .pipe(
      switchMap(() => {
        this.isLoading = true;
        return this.inventoryListService
          .getData(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            this.activeOnly,
            this.sort.active
              ? `${this.sort.active}_${this.sort.direction ? this.sort.direction : 'asc'}`
              : ''
          )
      })
    )
    .subscribe(
      (data) => {
        this.inventoryItems = data[0];
        this.itemsCount = data[1];
        this.isLoading = false;
      },
      (error) => {
        console.log('Table could not be filled with data', error);
        this.isLoading = false;
      }
    );
  }

  private fetchData() {
    this.isLoading = true;
    this.inventoryListService
      .getData(
        this.paginator.pageIndex + 1,
        this.paginator.pageSize,
        this.activeOnly,
        this.sort.active
          ? `${this.sort.active}_${this.sort.direction ? this.sort.direction : 'asc'}`
          : ''
      )
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data) => {
          this.inventoryItems = data[0];
          this.itemsCount = data[1];
        },
        (error) => {
          console.log('Table could not be filled with data', error);
        }
      );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.inventoryItems.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.inventoryItems.forEach((row) => this.selection.select(row));
  }

  onDelete(itemId: string){
    this.dialogService.openConfirmDialog("Are you sure to delete this item?")
    .afterClosed().subscribe(res =>{
      if(res){
         this.inventoryListService.deleteData(itemId).subscribe(() => {
      this.route.navigate(['/inventory']);
      this.fetchData();
         });
         this.snackBar.open("Successfully deleted!", '', {
           duration: 5000,
           verticalPosition: 'bottom'
         } );
      }
    });
  }

  printComponent(itemId) {
    this.inventoryListService.getDataById(itemId).subscribe((data) => {
      this.item = new InventoryItem(data);
    // let printContents = document.getElementById(cmpName).innerHTML;
      let originalContents = document.body.innerHTML;

    this.printValue = '<div>'+ 'Id: ' + this.item.id + '<br/' + '</div>';
    this.printValue += '<div>'+ 'Name: ' + this.item.name + '<br/' + '</div>';
    this.printValue += '<div>'+ 'Description: ' + this.item.description + '<br/' + '</div>';
    this.printValue += '<div>'+ 'Location: ' + this.item.location + '<br/' + '</div>';
    this.printValue += '<div>'+ 'Inventory number: ' + this.item.inventoryNumber + '<br/' + '</div>';
    document.body.innerHTML = this.printValue;
    
    window.print();

    document.body.innerHTML = originalContents;
    this.fetchData();
  
    });
}

    // document.body.innerHTML = originalContents;
}
  

