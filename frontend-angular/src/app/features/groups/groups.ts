import { Component } from '@angular/core';
import { MainLayout } from "../../core/layout/main-layout/main-layout";
import {faUsers} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-groups',
  imports: [MainLayout,FontAwesomeModule],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups {
  
 readonly faUsers = faUsers;

  readonly groups = [
    { id: 1, name: 'Sample Group One', description: 'This is a sample ExoBits social network group' },
    { id: 2, name: 'Sample Group Two', description: 'This is a sample ExoBits social network group' },
    { id: 3, name: 'Sample Group Three', description: 'This is a sample ExoBits social network group' },
    { id: 4, name: 'Sample Group Four', description: 'This is a sample ExoBits social network group' },
  ];

}
