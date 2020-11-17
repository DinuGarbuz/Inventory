import { Component, OnInit } from '@angular/core';
import { ContactProviderService } from '../../app-logic/contact-provider.service';
import { ContactData } from '../../app-logic/contact-data';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactData: ContactData;

  constructor(private contactProviderService:ContactProviderService) { }

  ngOnInit(): void {
    this.contactData = this.contactProviderService.getData();
  }

}
