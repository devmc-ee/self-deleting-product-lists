import type { FC } from "react";
import './ProductPool.scss';
import { PRODUCT_LOCATION, } from "../core/types";
import { ProductLane } from "./ProductLane";

export const ProductPool: FC = () => (
  <section className="product-pool">
    <ProductLane type={PRODUCT_LOCATION.general} classes="product-lane--default" />
    <div className="product-lane__group">
      {
        [PRODUCT_LOCATION.fruits, PRODUCT_LOCATION.vegitables]
          .map((location) => <ProductLane key={location} type={location} headerText={location} />)
      }
    </div>
  </section>
)