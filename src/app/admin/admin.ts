import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, Header, Footer, Sidebar],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

}
