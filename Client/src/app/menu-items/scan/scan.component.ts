import { Component, OnInit } from '@angular/core';
import {InventoryListService} from '../../app-logic/inventory-list.service';
import {BarcodeFormat} from '@zxing/library';
import {ActivatedRoute, Router} from '@angular/router';
import {InventoryItem} from '../../app-logic/inventory-item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {

  tourchEnable = false;
  currentDevice : MediaDeviceInfo = null;
  tryHarder = false;
  formats = [BarcodeFormat.QR_CODE]
  availableDevice: MediaDeviceInfo[];
  hasPermission : boolean;
  item: InventoryItem;
 // name: string;
  //location: string;
  addItemForm: FormGroup;
  isDisplayed = true;

  constructor(private router:Router,
    private fb: FormBuilder,
    private inventoryListService: InventoryListService,
    private route: Router,
    private snackBar:MatSnackBar,
    private activatedRoute: ActivatedRoute
    ) { }


    
  ngOnInit(): void {
    this.item = new InventoryItem();
    this.prepareForm();
     
  }



  onHasPermission(permission: boolean){
    this.hasPermission = permission;
  }

  onCamerasFound(devices: MediaDeviceInfo[]){
    this.availableDevice = devices;

  }

  onScanSuccess(data: string)
  {
    console.log('Datafrom QR: ' +data);
   
    

    this.item = JSON.parse(data);

    

   
    if(this.item.id){
      console.log("are id");
      this.router.navigate(['/edit/'+this.item.id])

      this.snackBar.open("Item successfully found!", '', {
        duration: 5000,
        verticalPosition: 'bottom'
      } );

    }
    else if(!this.item.id){

      this.prepareForm();
      this.isDisplayed=false;
      this.snackBar.open("Item not found, but you cand add this item!", '', {
        duration: 5000,
        verticalPosition: 'bottom'
      } );
    }
  }

  onSubmit() {
    this.item = new InventoryItem(this.addItemForm.value);
    this.item.modifiedAt = new Date();
    this.item.active = false;

    this.inventoryListService.addData(this.item).subscribe(() => {
      this.route.navigate(['/inventory']);
    });
  }
  public hasError = (contrloName: string, errorName: string) => {
    return this.addItemForm.controls[contrloName].hasError(errorName);
  };


  prepareForm() {
    this.addItemForm = this.fb.group({
      name: [this.item.name, Validators.required],
      description: [this.item.description, Validators.maxLength(100)],
      user: [this.item.user, Validators.required],
      location: [this.item.location, Validators.required],
      inventoryNumber: [this.item.inventoryNumber, Validators.required],
      createdAt: [
        // this.item.createdAt.toISOString().split('T')[0],
        // Validators.required,
      ],
    });
  }

}
