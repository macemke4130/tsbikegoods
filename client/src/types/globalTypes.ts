export interface DataObject {
  dataPoint: string;
  dataValue: string;
}

export interface LoginObject {
  success: boolean;
  emailAddress: string;
  displayName: string;
  jwt: string;
  message: string;
}
