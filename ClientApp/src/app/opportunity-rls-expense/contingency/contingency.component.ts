import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';

@Component({
  selector: 'app-contingency',
  templateUrl: './contingency.component.html',
  styleUrls: ['./contingency.component.scss']
})
export class ContingencyComponent implements OnInit {

  contingencyData: any;
  data: any[] = [];
  userAccess: any;
  isContingencyEnabledToEdit : boolean = false;
  years: number[] = [];
  months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 }
  ];
  @Output() closeContingencyModalValue = new EventEmitter<boolean>();
  private editingValue: { [key: string]: string } = {};


  constructor(private oppRlsExpService: OpportunityRlsExpenseService) { }

  ngOnInit(): void {
    // const currentYear = new Date().getFullYear();
    // for (let i = currentYear; i <= currentYear + 10; i++) {
    //   this.years.push(i);
    // }

    this.oppRlsExpService.userAccessData$.subscribe(data => this.userAccess = data);

    this.oppRlsExpService.rlsData$.subscribe((data: any) => {
      this.isContingencyEnabledToEdit =
        data?.opportunity?.status == 1 ||
        data?.opportunity?.status == 4 ||
        this.userAccess == 'Admin';

      if (data?.opportunity?.status == 4 && this.userAccess == 'FP_and_A')
        this.isContingencyEnabledToEdit = false;

      this.contingencyData = data?.costRateContingencies;

      const hikeStartYear = this.contingencyData.length
        ? Math.min(...this.contingencyData.map(c => c.hikeStartYear))
        : new Date().getFullYear();

      for (let i = hikeStartYear; i <= hikeStartYear + 10; i++) {
        this.years.push(i);
      }
    });
  }

  startEditing(event: Event, row: any, key: string): void {
    const target = event.target as HTMLElement;
    this.editingValue[key] = target.innerText.trim();
  }
  
  finishEditing(event: Event, row: any, key: string): void {
    const target = event.target as HTMLElement;
    const newValue = target.innerText.trim();
    if (newValue !== this.editingValue[key]) {
      const parsedValue = parseFloat(newValue);  
      if (isNaN(parsedValue)) {
        target.innerText = this.editingValue[key];
      } else {
        row[key] = parsedValue;
        this.saveRow();
      }
    }
    delete this.editingValue[key];
  }

  finishEditingSelect(event: Event, row: any, key: string): void {
    const target = event.target as HTMLSelectElement;
    const newValue = target.value;
  
    if (newValue !== this.editingValue[key]) {
      const parsedValue = Number(newValue);
      if (!isNaN(parsedValue)) {
        row[key] = parsedValue;
        this.saveRow();
      } else {
        target.value = this.editingValue[key];
      }
    }
  
    delete this.editingValue[key];
  }
  
  saveRow(){
    this.oppRlsExpService.updateContingencyData(this.contingencyData);
  }

  validateNumberInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const key = event.key;
  
    if ((key >= '0' && key <= '9') || key === '.' || allowedKeys.includes(key)) {
      return;
    }
    event.preventDefault();
  }

  closeModal(){
    this.closeContingencyModalValue.emit(false);
  }
}
