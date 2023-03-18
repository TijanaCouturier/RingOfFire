import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { collection } from 'firebase/firestore';
import { Firestore, addDoc } from '@angular/fire/firestore';
import { Game } from 'src/models/game';


@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  game: Game;

  constructor(public firestore: Firestore, private router: Router) { }

  ngOnInit(): void {
  }

  async newGame(){
   let game = new Game();
   const coll =  collection(this.firestore, 'games');
   //CRUD = Create => addDoc, Read, Update => setDoc, Delete
   let gameInfo = await addDoc(coll, game.toJson());
   this.router.navigateByUrl('game/' + gameInfo.id);
  }

}
  