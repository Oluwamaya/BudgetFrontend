import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedDate = new Date(control.value + 'T00:00:00');
    const currentDate = new Date();
    
    // Set the time to midnight for both dates to only compare the date parts
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (selectedDate < currentDate) {
      return { 'pastDate': true };
    }
    return null;
  };
}

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,CommonModule, FormsModule, HttpClientModule ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  public budgetForm : FormGroup
  public userId : any = "" 
  public isLoading : any = false
 
 
  constructor(private fb: FormBuilder, private http: HttpClient, private router : Router) {
    this.budgetForm = this.fb.group({
      name:['' , [Validators.required,]],
      date: ['', [Validators.required, futureDateValidator()]], // Add Validators as needed
      budget: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit(){
    const storedUserId = localStorage.getItem('userBudgetId');
    if (storedUserId) {
      this.userId = storedUserId;
    } else {
      const generate = Math.floor(2e9 + Math.random() * 8e9).toString(); 
      localStorage.setItem('userBudgetId', generate);
      this.userId = generate;
    }

  }

 
  get budget() {
    return this.budgetForm.get('budget');
  }

  onSubmit() {
    if (this.budgetForm.valid && this.userId !== "") {
      this.isLoading = true;
      const value = {
          date : this.budgetForm.get('date')?.value ,
          budget : this.budgetForm.get('budget')?.value ,
          name: this.budgetForm.get('name')?.value,
          userId : this.userId,
          
      }
      this.http.post<any>('https://budgetbkend-6f9ccab6bac3.herokuapp.com/budget', {value}).subscribe(
        response => {
          console.log('Response from backend:', response);
          const createdBudget = response.budgetInfo
          this.isLoading = false;
          
          
          localStorage.setItem("budgetInfo", JSON.stringify(createdBudget))
          this.router.navigate(["/view"])
          
        },
        error => {
          this.isLoading = false;
          console.error('Error:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  

  onViewCategory() {
    // Handle view category action
    console.log('View Category');
  }

}
