import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {InventoryListService} from '../../app-logic/inventory-list.service';
import {InventoryItem} from '../../app-logic/inventory-item';
import { Route } from '@angular/compiler/src/core';
//import { threadId } from 'worker_threads';


@Component({
  selector: 'app-show-item',
  templateUrl: './show-item.component.html',
  styleUrls: ['./show-item.component.css']
})
export class ShowItemComponent implements OnInit {

  itemId : string;
  item: InventoryItem;
  itemIsFound = false;

  constructor
  (private inventoryListService: InventoryListService,
    private activatedRoute: ActivatedRoute,
    private router: Router ) { 
      this.activatedRoute.params.subscribe( (params) =>{
        this.itemId = params.id;
      })
    }

  ngOnInit(): void {
    this.inventoryListService.getDataById(this.itemId).subscribe( (data) => {
      this.item = new InventoryItem(data);
      this.itemIsFound = this.item ? true : false;
      

    })
  }

}
