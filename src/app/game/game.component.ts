import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
 pickCardAnimation = false;
 currentCard: string = '';
 game: Game;
 gameOver = false;


  constructor(private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      //console.log(params.id);
    });
  }
  
  newGame(){
    this.game = new Game();
    
  }

  takeCard(){
    if(this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation =  true;
      
      console.log('New card: ' + this.game.currentCard);
      console.log('Game is', this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
      }, 1000);
    }


  }

  editPlayer(playerId: number) {
    console.log('Edit player', playerId);

    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      console.log('Received change', change);
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.player_images.splice(playerId, 1);
        } else {
          this.game.player_images[playerId] = change;
        }
     
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('profil-1.png');
    
      }
    });
  }




}
