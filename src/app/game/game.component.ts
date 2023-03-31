import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

 game: Game;
 gameId: string;
 gameOver = false;
 startGame = false;

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this
      .firestore
      .collection('games')
      .doc(this.gameId) 
      .valueChanges()
      .subscribe((game: any) => {
        this.gameAll(game);
      });
    });
  }


  gameAll(game: any){
    this.game.players = game.players;
    this.game.stack = game.stack;
    this.game.playedCards = game.playedCards;
    this.game.currentPlayer = game.currentPlayer;
    this.game.player_images = game.player_images;
    this.game.pickCardAnimation = game.pickCardAnimation,
    this.game.currentCard = game.currentCard;
  }
  

  newGame(){
    this.game = new Game(); 
    this.gameOver = false;
    this.startGame = false;
  }
 

  takeCard(){
    if(this.game.stack.length == 0) {
      this.gameOver = true;
      this.game.players = [];
    } else if (!this.game.pickCardAnimation) {
      this.gameCurrentCard();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }


  gameCurrentCard(){
    this.game.currentCard = this.game.stack.pop(); 
    this.game.pickCardAnimation =  true;
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length; 
    this.saveGame();
  }


  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.playerDelate(playerId);
        } else {
          this.game.player_images[playerId] = change;
        }
        this.saveGame();
      }
    });
  }


  playerDelate(playerId){
    this.game.players.splice(playerId, 1);
    this.game.player_images.splice(playerId, 1);
    if (this.game.players.length <= 1) {
      this.startGame = false;
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('profil-1.png');
        if (this.game.players.length > 1) {
          this.startGame = true;
        }
        this.saveGame();
      }
    });
  }


  saveGame(){
    this
    .firestore
    .collection('games')
    .doc(this.gameId) 
    .update(this.game.toJson());
  }
}



