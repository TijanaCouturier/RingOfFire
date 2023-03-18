import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {
 name: string = '';

 @HostListener('document:keypress', ['$event'])
 handleKeyboardEvent(event: KeyboardEvent) { 
   if (event.code == 'Enter') {
     document.getElementById("OkBTN").click();
   }
  }
  
  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) { }

  ngOnInit(): void {
  }


  onNoClick(){
    this.dialogRef.close();
  }
}
