import { Component } from '@angular/core';
import { RightSidebar } from "../right-sidebar/right-sidebar";

@Component({
  selector: 'app-main-layout',
  imports: [RightSidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
