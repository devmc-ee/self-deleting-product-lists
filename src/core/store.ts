import { create } from 'zustand';
import data from './data';
import { type Product, type ProductLocation, type UUID } from './types';
import { moveProductToItsGroup, resetProductLocation, setInitProductLocation, transformProductsArrayToMap } from './utils';

export type SelfCleanbaleListStoreData = {
  productLocationMap: ProductLocation,
  general: Product[];
  fruits: Product[];
  vegitables: Product[];
}

export type SelfCleanbaleListStoreActions = {
  changeLocation: (uuid: UUID) => void;
  resetLocation: (uuid: UUID) => void;
}

export type SelfCleanbaleListStore = SelfCleanbaleListStoreData & SelfCleanbaleListStoreActions

export const productsMap = transformProductsArrayToMap(data as Product[]);
const productLocationMap = setInitProductLocation(productsMap);

export const useStore = create<SelfCleanbaleListStore>(
  (set) => ({
    productLocationMap,
    general: [...productsMap.values()],
    fruits: [],
    vegitables: [],
    changeLocation: (uuid) => set(({ general, fruits, vegitables, productLocationMap }) => {
      const product = productsMap.get(uuid);

      if (!product) return ({ general, fruits, vegitables, productLocationMap });

      return moveProductToItsGroup({
        product,
        general,
        fruits,
        vegitables,
        productLocationMap
      });

    }),
    resetLocation: (uuid) => set(({ general, fruits, vegitables, productLocationMap }) => {
      const product = productsMap.get(uuid);

      if (!product) return ({ general, fruits, vegitables, productLocationMap });

      return resetProductLocation({
        product, general, fruits, vegitables, productLocationMap
      })
    }),
  }))