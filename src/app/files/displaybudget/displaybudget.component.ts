import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Aos from 'aos';

interface Item {
  _id: string;
  itemName: string;
  quantity: number;
  itemPrice: number;
  purchase: boolean;
  userId: string;
}

interface UpdateItemResponse {
  message: string;
  fetchItems: Item[];
}

@Component({
  selector: 'app-displaybudget',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './displaybudget.component.html',
  styleUrls: ['./displaybudget.component.css']
})
export class DisplaybudgetComponent implements OnInit {
  public itemForm: FormGroup;
  public budgetInfo: any = {};
  public fetchItemList: Item[] = [];
  public purchasedItemCount: number = 0;
  public unpurchasedItemCount: number = 0;
  public editMode: boolean = false;
  private editItemId: string = '';
  public totalSpent: number = 0;
  public remainingAmount: number = 0;
  public isLoading : any = false;

  constructor(
    private actRoute: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      itemName: ['', [Validators.required, Validators.minLength(3)]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      itemPrice: ['', [Validators.required, Validators.pattern('^[0-9]{2,}$'), Validators.pattern('^[0-9]*$')]],
      userId: ['', Validators.required]
    });
  }

  public id: string = '';

  ngOnInit() {
    Aos.init()
    window.scrollTo(0, 0);
    this.id = this.actRoute.snapshot.params['id'];
    const userId = localStorage.getItem('userBudgetId')!;
    if (this.id == "" || userId == "") {
      
      alert("Budget Id is required")
    } else {
      this.http.get<any>(`https://budgetbkend-6f9ccab6bac3.herokuapp.com/viewSingleBudget/${this.id}/${userId}`).subscribe((res) => {
        
        this.budgetInfo = res.fetchBud;
        this.fetchItemList = res.fetchItems || [];

        this.itemForm.patchValue({ userId: this.budgetInfo.userId });
        this.updateItemCounts();
        this.calculateTotals();
      }, (error) => {
        console.log(error);
        alert(error.error.message);
      });
    }
  }

  calculateTotals() {
    this.totalSpent = this.fetchItemList.reduce((sum, item) => sum + (item.itemPrice * item.quantity), 0);
    this.remainingAmount = this.budgetInfo.budgetPrice - this.totalSpent;
  }

  addCart() {
    this.itemForm.markAllAsTouched();
  
    if (this.itemForm.valid) {
      const formData = { ...this.itemForm.value, budgetId: this.id };
     
      
      const itemTotalPrice = formData.itemPrice * formData.quantity;
     

      if (this.remainingAmount < itemTotalPrice) {
        alert('Item price exceeds the remaining budget');
        return;
      }
  
     
  
      if (this.editMode) {
        this.editItem(formData);
      } else {
        this.addNewItem(formData);
      }
    } else {
    
      alert("Form is invalid")
    }
  }

  addNewItem(formData: any) {
    this.isLoading = true
  

    this.http.post<any>('https://budgetbkend-6f9ccab6bac3.herokuapp.com/itemList', formData).subscribe(
      response => {
       
        this.fetchItemList = response.fetchItems || [];
        this.updateItemCounts();
        this.resetForm();
        this.calculateTotals();
        this.isLoading = false
      },
      error => {
        this.isLoading = false
        
        alert(error.error.message);
      }
    );
  }

  editItem(formDated: any) {
    if (!this.editItemId) {
      console.error('Edit item ID is not set');
      return;
    }
    this.isLoading = true 
    
    

    this.http.put<any>(`https://budgetbkend-6f9ccab6bac3.herokuapp.com/updateItem/${this.editItemId}`, formDated).subscribe(
      response => {
       
        this.fetchItemList = response.fetchItems || [];
        this.updateItemCounts();
        this.resetForm();
        this.calculateTotals();
        this.isLoading = false
      },
      error => {
        console.error('Error:', error);
        this.isLoading = false
        alert(error.error.message)
      }
    );
  }

  togglePurchased(item: any) {
    const updatedItem = { ...item, purchase: !item.purchase };

    this.http.put<UpdateItemResponse>(`https://budgetbkend-6f9ccab6bac3.herokuapp.com/updatePurchase/${item._id}`, updatedItem).subscribe(
      (response) => {
        this.fetchItemList = response.fetchItems || [];
        this.updateItemCounts();
        this.cdr.detectChanges();
        this.calculateTotals();
      },
      (error) => {
        console.error('Error updating item', error);
        alert("Error updating item")
      }
    );
  }

  updateItemCounts() {
    if (this.fetchItemList) {
      this.purchasedItemCount = this.fetchItemList.filter(item => item.purchase).length;
      this.unpurchasedItemCount = this.fetchItemList.filter(item => !item.purchase).length;
    }
  }

  viewItem(id: string) {
    this.router.navigate(['/viewItem', id]);
  }

  editExistingItem(item: Item) {
    this.itemForm.patchValue({
      itemName: item.itemName,
      quantity: item.quantity,
      itemPrice: item.itemPrice,
      userId: item.userId
    });
    this.editMode = true;
    this.editItemId = item._id;
  }

  deleteItem(itemId: string) {
    this.http.delete<UpdateItemResponse>(`https://budgetbkend-6f9ccab6bac3.herokuapp.com/deleteItem/${itemId}`).subscribe(
      (response) => {
        this.fetchItemList = response.fetchItems || [];
        this.updateItemCounts();
        this.calculateTotals();
      },
      (error) => {
        console.error('Error deleting item', error);
        alert(error.error.message)
      }
    );
  }

  resetForm() {
    this.itemForm.reset({
      itemName: '',
      quantity: '',
      itemPrice: '',
      userId: this.budgetInfo.userId
    });
    this.editMode = false;
    this.editItemId = '';
  }
}
