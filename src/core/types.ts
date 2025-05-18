
export type ProductLocationStoreData = {
  productLocationMap: ProductLocation,
  general: Product[];
  fruits: Product[];
  vegitables: Product[];
}

export type ProductLocationStoreActions = {
  changeLocation: (uuid: UUID) => void;
  resetLocation: (uuid: UUID) => void;
}

export type ProductLocationStore = ProductLocationStoreData & ProductLocationStoreActions;

export type ValueOf<T> = T[keyof T]

export const PRODUCT_GROUP = {
  Vegetable: 'Vegetable',
  Fruit: 'Fruit'
} as const;

export type ProductType = ValueOf<typeof PRODUCT_GROUP>

export type Product = {
  type: ProductType;
  name: string;
  uuid: UUID
}

export const PRODUCT_LOCATION = {
  general: 'general',
  fruits: 'fruits',
  vegitables: 'vegitables'
} as const;

export type ProductLocationType = ValueOf<typeof PRODUCT_LOCATION>

/** uuidv4 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type ProductMap = Map<UUID, Product>;
export type ProductLocation = Map<UUID, ProductLocationType>

export type MoveProductToGroupData = ProductLocationStoreData & { product: Product }
export type MoveProductToDefaultGroupData = MoveProductToGroupData