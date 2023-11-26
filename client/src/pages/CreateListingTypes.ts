export interface DataObject {
  dataPoint: string;
  dataValue: string;
}

export interface BrandObject {
  id: number;
  brandName: string;
  brandSelect: number;
}

export interface ValidDataPoint {
  dataPoint: string;
  valid: boolean;
}

export interface StateObject {
  brandInput: string;
  brandSelect: number;
  categoryId: number;
  subcategoryId: number;
  title: string;
  quantity: number;
  itemCondition: number;
  price: number;
  deliveryId: number;
  descriptionText: string;
  descriptionCharacterCount: number;
}

export interface ServerOptionsObject {
  deliveryTypes: Array<DeliveryObject>;
  brands: Array<BrandObject>;
  categories: Array<CategoryObject>;
  itemConditions: Array<ItemConditionObject>;
}

export interface CategoryObject {
  id: number;
  category: string;
}

export interface SubCategoryArray {
  subcategories: Array<SubcategoryObject>;
}

export interface SubcategoryObject {
  id: number;
  subcategory: string;
}

export interface ItemConditionObject {
  id: number;
  itemConditionName: string;
}

export interface DeliveryObject {
  id: number;
  deliveryType: string;
}

export interface ConfigObject {
  requiredState: Array<string>;
  databaseLists: { categories: Array<CategoryObject>; subcategories: Array<SubcategoryObject>; brands: Array<BrandObject> };
}
