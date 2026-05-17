import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-right-sidebar',
  imports: [RouterLink,FontAwesomeModule],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.css',
})
export class RightSidebar {
  
  // React: Array(12).fill(0)
  readonly friends = Array.from({ length: 12 }, (_, i) => i);

  // React: [1,2,3]
  readonly latestGroups = [1, 2, 3];
  readonly faUser = faUser;
  readonly faUsers = faUsers;
  // Static text (same as React UI)
  readonly groupTitle = 'Sample Group One';
  readonly groupDesc = 'This is a Dobble social network sample group';

}
