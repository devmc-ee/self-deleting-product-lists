import { create } from 'zustand';
import data from './data';
import { type Product, type ProductLocationStore } from './types';
import { moveProductToItsGroup, resetProductLocation, setInitProductLocation, transformProductsArrayToMap } from './utils';

export const productsMap = transformProductsArrayToMap(data as Product[]);

export const useStore = create<ProductLocationStore>(
  (set) => ({
    productLocationMap: setInitProductLocation(productsMap),
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
        product,
        general,
        fruits,
        vegitables,
        productLocationMap
      })
    }),
  }))