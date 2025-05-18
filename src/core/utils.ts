import type { SelfCleanbaleListStoreData } from "./store";
import {
  PRODUCT_GROUP, PRODUCT_LOCATION,
  type MoveProductToDefaultGroupData,
  type MoveProductToGroupData,
  type Product,
  type ProductLocation,
  type ProductLocationType,
  type ProductMap,
  type UUID
} from "./types";
import { v4 as uuidv4 } from "uuid";

export const transformProductsArrayToMap = (products: Omit<Product, 'uuid'>[]): ProductMap => {
  const productMap = new Map<UUID, Product>();

  if (!Array.isArray(products)) {
    console.warn('Empty products list')
    return productMap;
  }

  for (const product of products) {
    const uuid = uuidv4() as UUID;
    productMap.set(uuid, { ...product, uuid });
  }

  return productMap;
}

export const setInitProductLocation = (products: ProductMap): ProductLocation => {
  const productLocationMap = new Map<UUID, ProductLocationType>();

  if (!(products instanceof Map)) {
    return productLocationMap;
  }

  for (const [uuid] of products) {
    productLocationMap.set(uuid as UUID, PRODUCT_LOCATION.general);
  }

  return productLocationMap;
}

export const moveProductToItsGroup = ({
  product,
  general,
  fruits,
  vegitables,
  productLocationMap
}: MoveProductToGroupData): SelfCleanbaleListStoreData => {
  if (!productLocationMap || !product) {
    return {
      general,
      fruits,
      vegitables,
      productLocationMap
    }
  }
  const newProductLocationMap = new Map([...productLocationMap.entries()]); // O(n)
  const { uuid, type } = product;

  if (!newProductLocationMap.has(uuid) || !Object.values(PRODUCT_GROUP).includes(type)) {
    return {
      general,
      fruits,
      vegitables,
      productLocationMap
    };
  }

  const newFruits = type === PRODUCT_GROUP.Fruit
    && newProductLocationMap.get(uuid) !== PRODUCT_LOCATION.fruits
    ? [...fruits, product]
    : fruits

  const newVegitables = product.type === PRODUCT_GROUP.Vegetable
    && newProductLocationMap.get(uuid) !== PRODUCT_LOCATION.vegitables
    ? [...vegitables, product]
    : vegitables

  newProductLocationMap.set(
    uuid,
    type === PRODUCT_GROUP.Fruit
      ? PRODUCT_LOCATION.fruits
      : PRODUCT_LOCATION.vegitables
  );

  return ({
    productLocationMap: newProductLocationMap,
    general: general.filter(({ uuid: _uuid }) => _uuid !== uuid),
    fruits: newFruits,
    vegitables: newVegitables,
  })
}

export const resetProductLocation = ({
  product,
  productLocationMap,
  fruits,
  vegitables,
  general
}: MoveProductToDefaultGroupData): SelfCleanbaleListStoreData => {
  if (!product || !productLocationMap) {
    return {
      productLocationMap,
      fruits,
      vegitables,
      general
    }
  }

  const newProductLocationMap = new Map([...productLocationMap.entries()]);
  const { uuid, type } = product;

  if (!newProductLocationMap.has(uuid) || !Object.values(PRODUCT_GROUP).includes(type)) {
    return {
      productLocationMap,
      fruits,
      vegitables,
      general
    };
  }

  const newGeneral = newProductLocationMap.get(uuid) !== PRODUCT_LOCATION.general
    ? [...general, product]
    : general;

  newProductLocationMap.set(uuid, PRODUCT_LOCATION.general)

  return {
    productLocationMap: newProductLocationMap,
    fruits: type === PRODUCT_GROUP.Fruit ? fruits.filter(({ uuid: _uuid }) => uuid !== _uuid) : fruits,
    vegitables: type === PRODUCT_GROUP.Vegetable ? vegitables.filter(({ uuid: _uuid }) => uuid !== _uuid) : vegitables,
    general: newGeneral
  }
}