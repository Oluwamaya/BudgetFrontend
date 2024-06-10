import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-displaybudget',
  standalone: true,
  imports: [RouterModule, FormsModule ,ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './displaybudget.component.html',
  styleUrl: './displaybudget.component.css'
})
export class DisplaybudgetComponent {
   public itemForm : any = FormGroup
   public budgetInfo : any = {}
   public fetchItemList : any[] = [{}]
   public purchasedItemCount: number = 0;
public unpurchasedItemCount: number = 0;

  constructor(private actRoute: ActivatedRoute, private http: HttpClient ,private fb: FormBuilder, private cdr : ChangeDetectorRef){
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      userId: ['', Validators.required]
    });
  }
   public id : any = "";
   

   public addToCart : any = {}
   ngOnInit(){
    this.id = this.actRoute.snapshot.params['id'] 
    const userId = localStorage.getItem("userBudgetId")!
    console.log(userId);
    
    if (this.id == "" || userId == "") {
      console.log("Budget Id is required");
      
    }else{

      this.http.get<any>(`http://localhost:4444/viewSingleBudget/${this.id}/${userId}`).subscribe((res)=>{
        console.log(res);
         this.budgetInfo = res.fetchBud
         this.fetchItemList = res.fetchItems
         this.fetchItemList = res.fetchItems.map((item: any) => ({ ...item, checked: item.purchase }));
         this.purchasedItemCount = this.fetchItemList.filter(item => item.purchase).length;
this.unpurchasedItemCount = this.fetchItemList.filter(item => !item.purchase).length;

         
         this.itemForm.patchValue({ userId: this.budgetInfo.userId });
        //  console.log(this.budgetInfo);
        //  console.log(this.fetchItemList);
         
         
      },(error)=>{
        console.log(error);
        alert(error.error.message)

      })
    }
  }

  addCart(){
    console.log( this.itemForm.value);
    if (this.itemForm.valid) {
      const formData = this.itemForm.value;
      console.log('Form Data:', formData);

      this.http.post<any>('http://localhost:4444/itemList', {formData}).subscribe(
        response => {
          console.log(response);
          this.fetchItemList = response.fetchItems
        },
        error => {
          console.error('Error:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  
  togglePurchased(item: any) {
    const updatedItem = { ...item, purchase: !item.purchase };
    
    this.http.put(`http://localhost:4444/updateItem/${item._id}`, updatedItem).subscribe(
      (response) => {
       
        // console.log(response);
        const index = this.fetchItemList.findIndex(i => i._id === item._id);
        if (index !== -1) {
          this.fetchItemList[index].purchase = !item.purchase;
          // Recalculate purchased and unpurchased item counts
          this.purchasedItemCount = this.fetchItemList.filter(item => item.purchase).length;
          this.unpurchasedItemCount = this.fetchItemList.filter(item => !item.purchase).length;
        }
        // console.log('New purchase state:', item.purchase);
        this.cdr.detectChanges();
        
        
      },
      (error) => {
        console.error('Error updating item', error);
      }
    );
  }
  

}
