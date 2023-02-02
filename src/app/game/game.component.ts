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
  @Input() playerRemove:boolean = true;
 game: Game; //neue Variable vom Typ Game - was ein Object ist - in game.ts
 gameId: string;
 gameOver = false;
 startGame = false;


  constructor(private firestore: AngularFirestore, private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log("test22");
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']); 
      this.gameId = params['id'];

      this
      .firestore
      .collection('games')
      .doc(this.gameId) 
      .valueChanges()
      .subscribe((game: any) => {
        //console.log('Game update', game.game);
        this.game.players = game.players;
        this.game.stack = game.stack;
        this.game.playedCards = game.playedCards;
        this.game.currentPlayer = game.currentPlayer;
        this.game.player_images = game.player_images;
        this.game.pickCardAnimation = game.pickCardAnimation,
        this.game.currentCard = game.currentCard;
        
      });
    });
  }
  
  newGame(){
    this.game = new Game(); 
    //Diese Variable kriegt ein Object erstellt. Es wird ein leeres JSON Object angelegt mit den Eigenschaften die in game.ts ist
  
    //Immer wenn wir ein neues Spiel anlegen, also wenn wir sagen this.game = new Game() machen wir neues Spiel, neues JSON/Object wo ein bisschen Logik drin ist. Also ein Array mit gemischten Karten
  }

  takeCard(){
    
    console.log('Game is', this.game);
    if(this.game.stack.length == 0) {
      this.gameOver = true;
      this.game.players = [];
     
    } else if (!this.game.pickCardAnimation) {
      //ich möchte dass die Animation ausgeführt wird nur wenn die pickCardAnimation false ist
      this.game.currentCard = this.game.stack.pop(); //mit this.game.stack greifen wir auf unseren Array zu. Mit pop nehmen wir das letzte Wert aus dem Array. Und dieses pop gibt uns das letzte Wert aus unserem Array zurück und gleichzeitig wird es aus unserem Array entfernt.
      //mit this.game.currentCard = this.game.stack.pop(); greifen wir auf die unterste Karte im Spiel. Das ist die unterste Karte
      this.game.pickCardAnimation =  true;
      console.log('New card: ' + this.game.currentCard); //welche Karte wird gezogen
      console.log('Game is', this.game);
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      
      this.saveGame();
      
      //ich möchte für jede Karte die Animation oben wiederholen und mit setTimeout wird die schon gezogene Karte entfernt und neue geladen mit der Animation von oben
      
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
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
          if (this.game.players.length <= 1) {
            console.log('Received change and EXE');
            this.startGame = false;
          }
        } else {
          this.game.player_images[playerId] = change;
        }
        this.saveGame();
      }
    });
  }

  openDialog(): void {
    
    console.log("testplayer");
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    //Mit dem Teil schließen wir den Dialog, aber ein Player wird erstellt (mit dem this.game.players.push(name);)
    dialogRef.afterClosed().subscribe((name: string) => {
      
      //mit if abfrage sagen wir, nur wenn name größer als 0 ist, dann erstelle ein Player
      //mit name && name.length > 0 checken wir zuerst ob ein name existiert, dann mit der if Abfrage, ob sie größer als 0 ist
      if(name && name.length > 0) {
        console.log("testplayer2");
        this.game.players.push(name);
        console.log(this.game.players);
        this.game.player_images.push('profil-1.png');
        if (this.game.players.length > 1) {
          this.startGame = true;
        }
       
        this.saveGame();
      }
    });
  }

  saveGame(){
  console.log("json");
  console.log(this.game.toJson());
    
    this
      .firestore
      .collection('games')
      .doc(this.gameId) 
      .update(this.game.toJson());
  }
}



