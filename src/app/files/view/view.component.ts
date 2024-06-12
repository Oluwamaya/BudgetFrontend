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
    console.log(this.getAllBudget);
    if (this.getAllBudget != null) {
      const id = this.getAllBudget
      console.log();
      
      this.http.get<any>(`http://localhost:4444/ViewBudget/${id}`).subscribe((res)=>{
        console.log(res);
        this.gab = res.allBudgets
        console.log(this.gab);
        
        
      },(error)=>{
        console.log(error);
        
      })
      
    }
   

  }
  viewSingleBudget(id : any ){
   console.log(id);
   
  this.router.navigate([`view/display/${id}`])
   
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd MMMM yyyy') || '';
  }
  deleteBudget(id: string) {
    console.log(id);
    
    if (confirm('Are you sure you want to delete this budget?')) {
      this.http.delete<any>(`http://localhost:4444/deleteBudget/${id}`).subscribe(
        response => {
          console.log('Budget deleted successfully:', response);
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
