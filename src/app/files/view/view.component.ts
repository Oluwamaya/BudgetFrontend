import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [HttpClientModule , CommonModule , FormsModule , RouterModule],
  providers: [DatePipe],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {constructor(private http : HttpClient , private datePipe : DatePipe){}
  public getAllBudget : any = localStorage.getItem("userBudgetId")! || null  
  public gab : any [] = []
  ngOnInit(){
    console.log(this.getAllBudget);
    if (this.getAllBudget != null) {
      const id = this.getAllBudget
      this.http.get<any>(`http://localhost:4444/ViewBudget/${id}`).subscribe((res)=>{
        console.log(res);
        this.gab = res.allBudgets
      },(error)=>{
        console.log(error);
        
      })
      
    }
   

  }
  viewSingleBudget(id : any){
   console.log(id);
   
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMMM yyyy') || '';
  }

}
