import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor( private router: Router) { } //

  ngOnInit(): void {
  }

  newGame(){
    //Start game
    let game = new Game();
    this.router.navigateByUrl('game');
  }
  

}
