import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-item',
  standalone: true,
  imports: [HttpClientModule ,CommonModule,MatCardModule,MatCheckboxModule,MatIconModule, RouterModule ],
  templateUrl: './view-item.component.html',
  styleUrl: './view-item.component.css'
})
export class ViewItemComponent {
  public itemId : any = ""
  public itemView : any  = {}
  constructor(private actRoute: ActivatedRoute ,private http : HttpClient ){}

  ngOnInit(){
    console.log(this.actRoute.snapshot);
    
    this.itemId = this.actRoute.snapshot.params['id']
    console.log(this.itemId);
    this.http.get<any>(`http://localhost:4444/viewItem/${this.itemId}`).subscribe((res)=>{
      console.log(res);
      this.itemView = res.fetchInfo
      
    },(error)=>{
      console.log(error);
      
    })
    
    
  }

}
