import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import banksData from './banks.json';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [NgClass],
  templateUrl: './banks.html',
  styleUrl: './banks.css'
})
export class BanksComponent {

  banks = banksData;

}