import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [HttpClientModule , ReactiveFormsModule, CommonModule , FormsModule , RouterModule],
  providers: [DatePipe],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {constructor(private http : HttpClient , private datePipe : DatePipe, private router: Router){}
  public getAllBudget : any = localStorage.getItem("userBudgetId")! || null  
  public gab : any [] = []
  ngOnInit(){
   
    if (this.getAllBudget != null) {
      const id = this.getAllBudget
     
      
      this.http.get<any>(`https://budgetbkend-6f9ccab6bac3.herokuapp.com/ViewBudget/${id}`).subscribe((res)=>{
        
        this.gab = res.allBudgets
        
        
        
      },(error)=>{
        console.log(error);
        
      })
      
    }
   

  }
  viewSingleBudget(id : any ){
  this.router.navigate([`view/display/${id}`])
   
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMMM yyyy') || '';
  }
  deleteBudget(id: string) {  
    if (confirm('Are you sure you want to delete this budget?')) {
      this.http.delete<any>(`https://budgetbkend-6f9ccab6bac3.herokuapp.com/deleteBudget/${id}`).subscribe(
        response => {
          this.gab = response.remainBudget;
          alert(response.message)
        },
        error => {
          console.error('Error deleting budget:', error);
        }
      );
    }
  }
}
