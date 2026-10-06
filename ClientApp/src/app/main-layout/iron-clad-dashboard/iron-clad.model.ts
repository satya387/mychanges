export interface IronCladContractDetails {
  Id?: number;
  id?: number;
  ContractId?: number | null;
  contractId?: number | null
  DateOfAggrement?: string | null;
  dateOfAggrement?: string | null;
  StartDate?: string | null;
  startDate?: string | null;
  EndDate?: string | null;
  endDate?: string | null;
  GroupMailId?: string | null;
  groupMailId?: string | null;
  Indemnity?: string | null;
  indemnity?: string | null;
  TerminationPeriod?: number | null;
  terminationPeriod?: number | null;
  LimitationOfLiability?: string | null;
  limitationOfLiability?: string | null;
  CreditPeriod?: number | null;
  creditPeriod?: number | null;
  EntityId?: number | null;
  entityId?: number | null;
  ProjectId?: number | null;
  projectId?: number | null;
  AccountId?: number | null;
  accountId?: number | null;
  documentType?: string;
  RateIncrease?: number | null;
  rateIncrease?: number | null;
  Nonsolicitation?: string | null;
  nonsolicitation?: string | null;
  Assignment?: string | null;
  assignment?: string | null;
  CreatedBy?: string | null;
  createdBy?: string | null;
  CreatedDate?: string | null;
  createdDate?: string | null;
  ModifiedBy?: string | null;
  modifiedBy?: string | null;
  ModifiedDate?: string | null;
  modifiedDate?: string | null;
  IsActive?: boolean;
  isActive?: boolean;
  contractAdminStatusId?: number | null;
  ContractAdminStatusId?: number | null;
  contractStatusName?: string | null;
  
 entityName?: string;
  accountName?: string;
  projectName?: string;
  fileNames?: string;
  fileList?: string[];
  comments?: string | null;
  DocumentId?: number | null;
  documentId?: number | null;
  DocumentName?: string;
  documentName?: string;
  ContractName?: string;
  contractName?: string;
  totalCount?: number;
  TotalCount?: number;
  salesforceId?: string;
  BU?: string; 
  bu?: string;
  isEmidsTemplate?: boolean | false;
  displayId ?: string;
    /* ================= REVENUE / MARGIN ================= */

  usRevenue?: number | null;
  usMargin?: number | null;

  canadaRevenue?: number | null;
  canadaMargin?: number | null;

  mexicoRevenue?: number | null;
  mexicoMargin?: number | null;

  argentinaRevenue?: number | null;
  argentinaMargin?: number | null;

  eastEuropeRevenue?: number | null;
  eastEuropeMargin?: number | null;

  indiaRevenue?: number | null;
  indiaMargin?: number | null;

  totalContractValue?: number | null;
  blendedMargin?: number | null;

  /* ================= SOW ================= */

  billingType?: string | null;
  resourceCount?: number | null;

  /* ================= CHANGE ORDER ================= */

  amendmentNumber?: string | null;
  changeDescription?: string | null;

  /* ================= WORK ORDER ================= */

  poNumber?: number | null;
  poAmount?: number |null;

  /* ================= FILE ================= */

  file?: File | null;

  // approval level 
  ApprovalLevel?: number | null;
  approvalLevel?: number | null;
  recordVersion?: string;
  isCreator?: boolean;
  isAdmin?: boolean;
}

export interface IronCladEntity {
  id: number;
  name: string;
  isActive?: boolean;
}
