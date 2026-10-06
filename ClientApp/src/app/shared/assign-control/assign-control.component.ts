import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { find } from 'lodash';
import { ToastService } from 'src/app/common/toast/toast.service';


@Component({
  selector: 'app-assign-control',
  templateUrl: './assign-control.component.html',
  styleUrls: ['./assign-control.component.scss']
})
export class AssignControlComponent implements OnInit {

  assignControlForm: FormGroup;
  @Input() selectedName: any;
  // @Input() selectedList: any = [];
  @Input() labelName: any;
  @Input() validateSectionRemove: any;
  @Input() placeholderText: any;
  @Output() onSelectData: EventEmitter<number> = new EventEmitter<number>();
  dataList: any;
  selectedDataList: any;
  showError: boolean;
  selectedObject: any;
  // autoCompleteList: any;
  @Input()
  set autoCompleteList(data) {
    if (data) {
      this.dataList = data;
    }
  }

  @Input()
  set selectedList(data) {
    if (data) {
      this.selectedDataList = data;
    }
  }

  constructor(private toastService: ToastService, private formBuilder: FormBuilder) {
    this.selectedDataList = [];
    this.showError = false;
  }

  ngOnInit(): void {
    this.formInitialization();
  }

  formInitialization() {
    this.assignControlForm = this.formBuilder.group({
      currentItem: [null, [Validators.required]]
    })
  }

  onSelectItem(data) {
    if (data) {
      this.selectedObject = this.dataList.find(list => list.name === data);
      if (!this.selectedObject) {
        this.assignControlForm.controls.currentItem.setErrors({ 'invalid': true });
        this.assignControlForm.controls['currentItem'].updateValueAndValidity();
        this.assignControlForm.reset();
        this.onSelectData.emit(undefined);
        return;
      }
      const isAvailable = this.checkIfItemAdded(this.selectedObject);
      if (!isAvailable) {
        this.selectedDataList.push(this.selectedObject);
        this.onSelectData.emit(this.selectedDataList);
      } else {
        this.toastService.showWarning('Selected ' + this.labelName + ' already added', 'Alert');
      }
      this.assignControlForm.reset();
    }
  }

  checkIfItemAdded(selectedObject) {
    if (this.selectedDataList?.length) {
      const dataExists = find(this.selectedDataList, { 'id': selectedObject.id })
      return dataExists;
    }
  }

  removeItem(index, data) {
    if (this.validateSectionRemove && data.isRoleAssigned) {
      this.toastService.showWarning('Section is mapped to Role and cannot be deleted!', 'Alert');
      return;
    } else if (this.validateSectionRemove && data.isDefault) {
      this.toastService.showWarning('This is a default section and cannot be deleted!', 'Alert');
      return;
    }
    this.selectedDataList.splice(index, 1);
    if (this.selectedDataList.length) {
      this.onSelectData.emit(this.selectedDataList);
    } else {
      this.onSelectData.emit(undefined);
    }
  }

}
