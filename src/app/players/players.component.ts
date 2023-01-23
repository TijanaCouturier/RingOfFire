import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  @Input() name; 
  @Input() image = 'profil-1.png';
  @Input() playerActive:boolean = false; //das bedeutet dass der Spieler standardmäßig nicht aktiv ist

  constructor() { }

  ngOnInit(): void {
  }

}
