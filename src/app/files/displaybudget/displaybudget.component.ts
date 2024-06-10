import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-displaybudget',
  standalone: true,
  imports: [RouterModule, FormsModule , CommonModule, HttpClientModule],
  templateUrl: './displaybudget.component.html',
  styleUrl: './displaybudget.component.css'
})
export class DisplaybudgetComponent {
  constructor(private actRoute: ActivatedRoute, private http: HttpClient){}
   public id : any = ""
   public budgetInfo : any = {}
   ngOnInit(){
    this.id = this.actRoute.snapshot.params['id'] 
    if (this.id == "") {
      console.log("Budget Id is required");
      
    }else{
      this.http.get<any>(`http://localhost:4444/viewSingleBudget/${this.id}`).subscribe((res)=>{
        console.log(res);
         this.budgetInfo = res.fetchBud.budgetPrice
         console.log(this.budgetInfo);
         
      },(error)=>{
        console.log(error);
        alert(error.error.message)

      })
    }
      
    

  }


}
