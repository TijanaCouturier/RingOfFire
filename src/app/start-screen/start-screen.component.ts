import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { collection } from 'firebase/firestore';
import { Firestore, addDoc } from '@angular/fire/firestore';
//import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Game } from 'src/models/game';


@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  game: Game;

  constructor(private firestore: Firestore, private router: Router) { } // private firestore: AngularFirestore,

  ngOnInit(): void {
  }

  async newGame(){
    //Start game
    let game = new Game();

   const coll =  collection(this.firestore, 'games');
   console.log("Document written with ID: ", coll);
   console.log("Document written with ID: ", game);
   //CRUD = Create => addDoc, Read, Update => setDoc, Delete
   let gameInfo = await addDoc(coll, game.toJson());
   console.log(gameInfo);
  this.router.navigateByUrl('game/' + gameInfo.id);
   
  }


/* VARIANTE 1
    if(this.game){
      this.firestore
      .collection('games')
      .add(this.game.toJson())
      .then((gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      });
    }
  */
  }
  




/* VARIANTE 2
  async newGame(){
    //Start game
    let game = new Game();

   const coll =  collection(this.firestore, 'games');
   console.log("Document written with ID: ", coll);
   console.log("Document written with ID: ", game);
   //CRUD = Create => addDoc, Read, Update => setDoc, Delete
   let gameInfo = await addDoc(coll, game.toJson());
   console.log(gameInfo);
  this.router.navigateByUrl('game/' + gameInfo.id);
   
  }
*/