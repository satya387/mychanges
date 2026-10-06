export interface IdValue{
id: number;
value: string;
}

export interface RLSInputBindingModel{
    startDate: Date;
    endDate: Date;
    shiftType: string;
    location: string;
    role: string;
    technology: string;
    experience: string;
}

export interface ExpenseInputBindingModel{
  startDate: Date;
  endDate: Date;
  shiftType: string;
  location: string;
  role: string;
  technology: string;
  experience: string;
  opportunityId: number;
  expenseCatogory: string;
  billType: number;
}

export interface OpportunityData {
    CP: string,
    BU: string
    clientName: string,
    clientMarginPlan: string,
    engagementType: string,
    projectType: string,
    pricingMethodology: string,
    projectStart: string,
    projectEnd: string,
    termInMonths: string,
    creditRating: string,
    opportunityId: string,
    name: string,
    id: number;
    DP: string;
    parentOpportunityId: string;
    CPMailId: string;
    DPMailId: string;
    accountId: string;
    projectName: string;
    resourcesOffShore: number;
    projectID: number;
    resourcesOnsite: number;
    revisedStartDate: string;
    entity: string;
    practice: string;
    confidenceLevel: string
    probability: number;
    opportunityStage: string;
    thisYearACV: number;
    revisedTCV: number;
    nextYearWACV: number;
    nextYearACV: number;
    amountTCV: number;
    thisYearWacv: number;
    status: number;
    ApprovedBy: string;
    ApprovedComments: string;
    RejectedBy: string;
    RejectedComments: string;
    IsBillable : string,
    IsPartialAllocation : string;
    ironcladId: string;
    versionNumber: string;
  };

export interface ResourceDetail {
    SF_RLS_Details_Id: number;
    ResourceCount: number;
    Month: number;
    Year: number;
  }

  export interface ExpenseDetail {
    ExpenseAmount: number;
    ActualExpenseAmount: number;
    Month: number;
    Year: number;
    Id: number;
  }

  export interface OpportunityWiseBusiness{
    expense: string,
    margin: string,
    revenue: string,
    marginPercentage: number,
    discountAmount: number,
    discountPercentage: number,
    discountedRevenue: string,
    discountedMargin: string,
    discountedMarginPercentage: number,
    contingencyPercentage: number
  }