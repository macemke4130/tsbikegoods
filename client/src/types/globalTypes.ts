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

export interface ProfileState {
  id: number;
  emailAddress: string;
  userPassword: string;
  retypePassword: string;
  displayName: string;
  defaultLocation: string;
  cash: boolean;
  venmo: string;
  paypal: string;
  cashapp: string;
  zelle: string;
  applepay: string;
  googlepay: string;
  products: Array<ProductObject>;
}

export interface ProductObject {
  id: number;
  dateListed: string;
  userId: number;
  sold: boolean;
  quantity: number;
  price: number;
  itemCondition: number;
  title: string;
  brand: number;
  descriptionId: number;
  photosId: number;
  categoryId: number;
  subcategoryId: number;
  deliveryId: number;
}
