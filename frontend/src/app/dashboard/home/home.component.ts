import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HeroComponent } from '../hero/hero.component';
import { FooterComponent } from '../footer/footer.component';
import { CrossSellComponent } from '../cross-sell/cross-sell.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [HeaderComponent, HeroComponent, FooterComponent, CrossSellComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {}
