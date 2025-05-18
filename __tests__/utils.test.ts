import { expect, test } from 'vitest';
import { transformProductsArrayToMap, setInitProductLocation, moveProductToItsGroup, resetProductLocation } from '../src/core/utils';
import { Product, PRODUCT_LOCATION } from '../src/core/types';

const products = Object.freeze([
  {
    type: 'Fruit',
    name: 'Apple',
  },
  {
    type: 'Vegetable',
    name: 'Broccoli',
  },
  {
    type: 'Vegetable',
    name: 'Mushroom',
  }]);


test('Should transform products array to map with uuid', () => {
  const productMap = transformProductsArrayToMap(products as Product[]);
  expect(productMap.size).toBe(3);

  let i = 0;
  productMap.forEach((product, uuid) => {
    expect(product).toStrictEqual({ ...products[i++], uuid });

  })
});


test('Should return empty map for empty product list', () => {
  const productMap = transformProductsArrayToMap([]);
  expect(productMap.size).toBe(0);
});

test('Should create an init location map', () => {
  const productMap = transformProductsArrayToMap(products as Product[]);
  // console.log(productMap)

  const locationMap = setInitProductLocation(productMap);
  // console.log(locationMap)
  expect(locationMap.size).toBe(3);
  expect([...locationMap.values()][0]).toBe(PRODUCT_LOCATION.general);
});

test.each([
  [''],
  [{}],
  [null],
  [undefined],
  [[]],
  [3214],
  [false],
])('Should return an empty map on invalid product map: "$0" ', (invalid) => {
  //@ts-expect-error invalid type
  const locationMap = setInitProductLocation(invalid);
  expect(locationMap.size).toBe(0);
});

test('Should change product default location to a specific group', () => {
  const productMap = transformProductsArrayToMap(products as Product[]);
  const locationMap = setInitProductLocation(productMap);

  const general = [...productMap.values()];
  expect(general.length).toBe(3);

  const fruits = [], vegitables = [];

  const [uuid1] = [...locationMap.entries()][0];
  const [uuid2] = [...locationMap.entries()][1];

  expect(productMap.get(uuid1)).toStrictEqual({
    type: 'Fruit',
    name: 'Apple',
    uuid: uuid1
  });
  expect(productMap.get(uuid2)).toStrictEqual({
    type: 'Vegetable',
    name: 'Broccoli',
    uuid: uuid2
  });

  expect(locationMap.get(uuid1)).toBe(PRODUCT_LOCATION.general);
  expect(locationMap.get(uuid2)).toBe(PRODUCT_LOCATION.general);

  const product = productMap.get(uuid1) as Product;

  const {
    general: newGeneral,
    fruits: newFruits,
    vegitables: newVegitables,
    productLocationMap: newProductLocationMap
  } = moveProductToItsGroup({
    product,
    productLocationMap: locationMap,
    general,
    fruits,
    vegitables
  });

  expect(newGeneral.length).toBe(2);
  expect(newFruits.length).toBe(1);
  expect(newFruits[0]).toStrictEqual(product);
  expect(newVegitables.length).toBe(0);
  expect(newProductLocationMap.get(product.uuid)).toBe(PRODUCT_LOCATION.fruits);
})


test.each([
  [undefined],
  [null],
  [1],
  [''],
  [{}],
  [[]],
])('Should should return same data on invalid product: $0 ', (product) => {
  const productMap = transformProductsArrayToMap(products as Product[]);
  const locationMap = setInitProductLocation(productMap);

  const general = [...productMap.values()];
  expect(general.length).toBe(3);

  const fruits = [], vegitables = [];
  const {
    general: newGeneral,
    productLocationMap
  } = moveProductToItsGroup({
    // @ts-expect-error invalid types
    product, general, fruits, vegitables, productLocationMap: locationMap
  });
  expect(newGeneral).toStrictEqual(general);
  expect(productLocationMap).toStrictEqual(locationMap);
})

test('Should should return same productLocation on invalid product type', () => {
  const productMap = transformProductsArrayToMap(products as Product[]);
  const locationMap = setInitProductLocation(productMap);
  const general = [...productMap.values()];

  const product = [...locationMap.entries()][0];
  const {
    general: newGeneral,
    productLocationMap: newLocationMap
  } = moveProductToItsGroup({
    // @ts-expect-error invalid types
    product: {...product, type: 'invalid'}, general, fruits: [], vegitables: [], productLocationMap: locationMap
  });
    expect(newGeneral).toStrictEqual(general);
    expect(newLocationMap).toStrictEqual(locationMap);

})

test('Should should reset product location to default group', () => {
  const productMap = transformProductsArrayToMap(products as Product[]);
  const locationMap = setInitProductLocation(productMap);

  const general = [...productMap.values()];
  const product = general[0];

  expect(general.length).toBe(3);

  const {
    general: newGeneral,
    productLocationMap: newProductLocationMap,
    fruits,
    vegitables
  } = moveProductToItsGroup({product, general, vegitables: [], fruits: [], productLocationMap: locationMap});
  expect(newGeneral.length).toBe(2);
  expect(fruits.length).toBe(1);
  expect(vegitables.length).toBe(0);
  expect(fruits[0]).toStrictEqual(product);
  expect(newProductLocationMap.get(product.uuid)).toBe(PRODUCT_LOCATION.fruits);

  const {
    general: newGeneral2,
    productLocationMap: newProductLocationMap2,
    fruits: fruits2,
    vegitables: vegitables2
  } = resetProductLocation({
    product,
    productLocationMap: newProductLocationMap,
    fruits,
    vegitables,
    general: newGeneral
  });
  expect(newGeneral2.length).toBe(3);
  expect(fruits2.length).toBe(0);
  expect(vegitables2.length).toBe(0);
  expect(newGeneral2[newGeneral2.length-1]).toStrictEqual(product);
  expect(newProductLocationMap2.get(product.uuid)).toBe(PRODUCT_LOCATION.general);

  const {
    general: newGeneral3,
    productLocationMap: newProductLocationMap3,
    fruits: fruits3,
    vegitables: vegitables3
  } = resetProductLocation({
    product,
    productLocationMap: newProductLocationMap2,
    fruits: fruits2,
    vegitables: vegitables2,
    general: newGeneral2
  });

  expect(newGeneral3.length).toBe(3);
  expect(fruits3.length).toBe(0);
  expect(vegitables3.length).toBe(0);
  expect(newGeneral2[newGeneral2.length-1]).toStrictEqual(product);
  expect(newProductLocationMap3.get(product.uuid)).toBe(PRODUCT_LOCATION.general);
})