import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ExpenseInputBindingModel,
  RLSInputBindingModel,
} from './opportunity-rls-expense-model';

@Injectable({
  providedIn: 'root',
})
export class OpportunityRlsExpenseService {
  private BASE_URL = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}
  private isSubmitActiveSource = new BehaviorSubject<boolean>(false);
  private opportunityDataSubject = new BehaviorSubject<any>({
    CP: '',
    BU: '',
    clientName: '',
    clientMarginPlan: '',
    engagementType: '',
    projectType: '',
    pricingMethodology: '',
    projectStart: '',
    projectEnd: '',
    termInMonths: '',
    creditRating: '',
  });
  private rlsDataSource = new BehaviorSubject<any>({});
  private expenseDataSource = new BehaviorSubject<any>({});
  private goToCreatePageSubject = new BehaviorSubject<boolean>(false);
  private editOpportunitySubject = new BehaviorSubject<any>({});
  private opportunityWiseSubject = new BehaviorSubject<any>({});
  private opportunitiesToBeFilteredSubject = new BehaviorSubject<any>({});
  private userAccessSubject = new BehaviorSubject<any>({});
  private opportunitySelectedSubject = new BehaviorSubject<boolean>(false);
  private isGraphDashboardUpSubject = new BehaviorSubject<boolean>(false);
  private updateContingencyDataSubject = new BehaviorSubject<any>({});

  createPageValue$ = this.goToCreatePageSubject.asObservable();
  opportunityData$ = this.opportunityDataSubject.asObservable();
  rlsData$ = this.rlsDataSource.asObservable();
  expenseData$ = this.expenseDataSource.asObservable();
  editOpportunityData$ = this.editOpportunitySubject.asObservable();
  opportunityWiseMarginData$ = this.opportunityWiseSubject.asObservable();
  opportunitiesToBeFilteredData$ =
    this.opportunitiesToBeFilteredSubject.asObservable();
  userAccessData$ = this.userAccessSubject.asObservable();
  opporitunitySelectedData$ = this.opportunitySelectedSubject.asObservable();
  isGraphDashboardUpData$ = this.isGraphDashboardUpSubject.asObservable();
  getContingencyData$ = this.updateContingencyDataSubject.asObservable();
  isSubmitActive$ = this.isSubmitActiveSource.asObservable();


  updateContingencyData(data: any){
    this.updateContingencyDataSubject.next(data);
  }

  updateSelectedOpportunity(data: any){
    this.opportunitySelectedSubject.next(data);
  }

  updateOpportunityData(newData: any) {
    this.opportunityDataSubject.next(newData);
  }

  updateEditOpportunityData(data: any) {
    this.editOpportunitySubject.next(data);
  }

  updategoToCreatePageValue(data: any) {
    this.goToCreatePageSubject.next(data);
  }

  setRLSData(data: any) {
    this.rlsDataSource.next(data);
  }

  setExpenseData(data: any) {
    this.expenseDataSource.next(data);
  }

  updateOpportunityWiseMarginData(data: any): any {
    this.opportunityWiseSubject.next(data);
  }

  filterOpportunities(data: any): any {
    this.opportunitiesToBeFilteredSubject.next(data);
  }

  setUserAccess(data: any): any {
    this.userAccessSubject.next(data);
  }

  setisGraphDashboardUpValue(data: any){
    this.isGraphDashboardUpSubject.next(data);
  }

  getAllOpportunity(empMailId: string, isAdmin: boolean): any {
    let params = new HttpParams().set('empMailId', empMailId).set('isAdmin', isAdmin)
    return this.http.get(this.BASE_URL + 'RLSProcess/GetAllOpportunities', {
      params,
    });
  }

  getOpportunityById(opportunityId: string): any {
    let params = new HttpParams().set('opportunityId', opportunityId);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetOpportunityById', {
      params,
    });
  }

  getOpportunityAndRLSDetails(editOpportunityObject): any {
    let params = new HttpParams().set('opportunityId', editOpportunityObject.opportunityId).set('id',editOpportunityObject.id);
    return this.http.get(
      this.BASE_URL + 'RLSProcess/GetOpportunityAndRLSDetails',
      { params }
    );
  }

  getAllSFLocation(): any {
    return this.http.get(this.BASE_URL + 'RLSProcess/GetAllSFLocation');
  }

  getAllRLSLocation(): any {
    return this.http.get(this.BASE_URL + 'RLSProcess/GetAllRLSLocation');
  }

  getAllSFRole(locationObject: RLSInputBindingModel): any {
    return this.http.post(
      this.BASE_URL + 'RLSProcess/GetAllRLSRole',
      locationObject
    );
  }

  getAllSFTechnology(technologyObject: RLSInputBindingModel): any {
    return this.http.post(
      this.BASE_URL + 'RLSProcess/GetAllRLSTechnology',
      technologyObject
    );
  }

  getAllSFExperience(experienceObject: RLSInputBindingModel): any {
    return this.http.post(
      this.BASE_URL + 'RLSProcess/GetAllRLSExperience',
      experienceObject
    );
  }

  getBillRateAndResourceCode(billRateObject: RLSInputBindingModel): any {
    return this.http.post(
      this.BASE_URL + 'RLSProcess/GetBillRateAndResourceCode',
      billRateObject
    );
  }

  getCostAndResourceCode(costObject: RLSInputBindingModel): any {
    return this.http.post(
      this.BASE_URL + 'RLSProcess/GetCostAndResourceCode',
      costObject
    );
  }

  getShiftAllowance(shiftAllowanceObject: RLSInputBindingModel): any {
    return this.http.post(
      this.BASE_URL + 'RLSProcess/GetShiftAllowance',
      shiftAllowanceObject
    );
  }

  saveOpportunityData(saveData: any): any {
    return this.http.post(
      this.BASE_URL + 'RLSProcess/SaveOpportunityData',
      saveData
    );
  }

  getAllRLSExpenseCategory(): any {
    return this.http.get(this.BASE_URL + 'RLSProcess/GetAllRLSExpenseCategory');
  }

  getRLSExpensesById(expenseObject: ExpenseInputBindingModel): any {
    return this.http.post(
      this.BASE_URL + 'RLSProcess/GetRLSExpensesById',
      expenseObject
    );
  }

  saveRLSExpenseData(saveData: any): any {
    return this.http.post(
      this.BASE_URL + 'RLSProcess/SaveRLSExpenseData',
      saveData
    );
  }

  getRlsAndRLSAllocationDetails(id: number): any {
    let params = new HttpParams().set('id', id);
    return this.http.get(
      this.BASE_URL + 'RLSProcess/GetRlsAndRLSAllocationDetails',
      { params }
    );
  }

  getOpportunityDashboardGrid(): any {
    return this.http.get(
      this.BASE_URL + 'RLSProcess/GetOpportunityDashboardGrid'
    );
  }

  deleteRLSDetailsById(id: any): any {
    let params = new HttpParams().set('id', id);
    return this.http.delete(this.BASE_URL + 'RLSProcess/DeleteRLSDetailsById', {
      params,
    });
  }

  deleteRLSExpenseById(expenseObject: any): any {
    let params = new HttpParams()
      .set('opportunityId', expenseObject.opportunity_Details_Id)
      .set('expenseCatogory', expenseObject.expenseCategory)
      .set('billType', expenseObject.billType)
      .set('location', expenseObject.location);
    return this.http.delete(this.BASE_URL + 'RLSProcess/DeleteRLSExpenseById', {
      params,
    });
  }

  approveRejectOpportunity(approveRejectObject: any): any {
    return this.http.put(
      this.BASE_URL + 'RLSProcess/UpdateOpportunityStatus',
      approveRejectObject
    );
  }

  getRLSAccessByEmpemidsId(): any {
    return this.http.get(this.BASE_URL + 'RLSProcess/GetRLSAccessByEmpemidsId');
  }

  saveOpportunityDiscount(discountObject: any): any {
    return this.http.post(this.BASE_URL + 'RLSProcess/SaveOpportunityDiscount', discountObject);
  }

  saveContingencyPercentage(contingencyObject: any): any{
    return this.http.post(this.BASE_URL + 'RLSProcess/SaveContingencyPercentage', contingencyObject);
  }

  downloadPLViewReport(requestBody): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        var res =  this.http.post<HttpResponse<any>>(this.BASE_URL + 'RLSProcess/GetPLViewReport', requestBody, {
          headers: headers,
          responseType: 'blob' as 'json',
          observe: 'response' as 'body'
        });
        return res;
  }

  downloadFTEUtilizationReport(requestBody): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        var res =  this.http.post<HttpResponse<any>>(this.BASE_URL + 'RLSProcess/GetFTEUtilizationReport', requestBody, {
          headers: headers,
          responseType: 'blob' as 'json',
          observe: 'response' as 'body'
      });
    return res;
  }

  getPLViewHtmlReport(id: number): any {
    let params = new HttpParams().set('Id', id);
    return this.http.get( this.BASE_URL + 'RLSProcess/GetPLViewHtmlReport', { params });
  }

  UploadRLSDocument(requestBody: FormData) {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    }); 
    var a = this.http.post(this.BASE_URL + 'RLSProcess/Upload', requestBody, { headers });
    return a;
  }

  copyOpportunityData(copyOpportunityDataObject){
    return this.http.post(this.BASE_URL + 'RLSProcess/CopyOpportunityData', copyOpportunityDataObject);
  }

  saveCostRateContingencyData(saveCostRateContingencyDataObject){
    return this.http.post(this.BASE_URL + 'RLSProcess/SaveCostRateContingencyData', saveCostRateContingencyDataObject);
  }

  // ARC DB - Dashboard Chart's Section
  getSoldOpportunityData(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetSoldOpportunityData', { params });
  }

  getTopTenTCVData(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetTopTenTCVData', { params }); 
  }

  getTopSkillsByRevenueDemandData(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetTopSkillsByRevenueDemandData', { params }); 
  }

  getOpportunityByClientPartnerData(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetOpportunityByClientPartnerData', { params }); 
  }

  getAverageDirectMarginData(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetAverageDirectMarginData', { params }); 
  }

  getFTEHeadCountData(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetFTEHeadCountData', { params }); 
  }

  getResourceTalentMixData(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetResourceTalentMixData', { params }); 
  }

  getShoreWiseAverageBillRateData(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetShoreWiseAverageBillRateData', { params }); 
  }

  getShoreWiseAverageCostData(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetShoreWiseAverageCostData', { params }); 
  }

  getShoreWiseMarginMixData(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetShoreWiseMarginMixData', { params }); 
  }

  // Erika DB - Dashboard Chart's Section

  getOpportunityByTCV(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetOpportunityByTCV', { params });
  }

  getOpportunityByCP(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetOpportunityByCP', { params });
  }

  getOpportunityByStage(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetOpportunityByStage', { params });
  }

  getOpportunityCountMonthWiseByStage(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetOpportunityCountMonthWiseByStage', { params });
  }

  getTopTenTCVByAccount(year: number){
    let params = new HttpParams().set('Year', year);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetTopTenTCVByAccount', { params });
  }

  getAllCreatedProjects(data): any {
    let params = new HttpParams()
      .set('PageNumber', data.PageNumber)
      .set('PageSize', data.PageSize)
      .set('EmpEmidsId', data.EmpEmidsId)
      .set('ProjectId', data.ProjectId);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetAllCreatedProjects', { params });
  }

  getUploadFile(requestBody): Observable<HttpResponse<any>> {
    debugger;
    return this.http.post<HttpResponse<any>>(
      this.BASE_URL + 'RLSProcess/GetRlsFile', requestBody, 
      {
        responseType: 'blob' as 'json',
        observe: 'response' as 'body'
      });
  }

  getProjectList() {
    return this.http.get(this.BASE_URL + 'RLSProcess/GetProjectList');
  }

  downloadPAViewReport(requestBody): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        var res =  this.http.post<HttpResponse<any>>(this.BASE_URL + 'RLSProcess/GetPAViewReport', requestBody, {
          headers: headers,
          responseType: 'blob' as 'json',
          observe: 'response' as 'body'
        });
        return res;
  }

  getPAViewHtmlReport(data): any {
    let params = new HttpParams().set('Year', data.Year).set('Month', data.Month);
    return this.http.get( this.BASE_URL + 'RLSProcess/GetPAViewHtmlReport', { params });
  }

  getPAByMonthAndYear(year: number, month: number){
    let params = new HttpParams().set('Year', year).set('Month', month);
    return this.http.get(this.BASE_URL + 'RLSProcess/GetPAByMonthAndYear', { params });
  }
  getAllRLSTimelineList(id): any {
    let params = new HttpParams().set('Id', id);
    return this.http.get(
      this.BASE_URL + 'RLSProcess/GetALLTimeLineData',
      { params }
    );
  }

  updateIsSubmitActive(value: boolean) {
    this.isSubmitActiveSource.next(value);
  }
}
