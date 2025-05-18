import type { FC } from "react";
import { type ProductLocationType, type UUID } from "../core/types";
import { useStore } from "../core/store";
import { useShallow } from "zustand/react/shallow";
import { ProductButtonList } from "./ProductButtonList";

interface ProductLaneProps {
  type: ProductLocationType,
  headerText?: string
  classes?: string;
}
const { VITE_RESET_PRODUCT_LOCATION_TIMEOUT_MS: RESET_PRODUCT_LOCATION_TIMEOUT_MS } = import.meta.env;

export const ProductLane: FC<ProductLaneProps> = ({ type, headerText = "", classes = "" }: ProductLaneProps) => {
  const products = useStore(useShallow((state) => state[type] || []));

  const changeLocation = useStore(({ changeLocation }) => changeLocation);
  const resetLocation = useStore(({ resetLocation }) => resetLocation);

  const onClick = (uuid: UUID): void => {
    if (headerText) {
      return resetLocation(uuid)
    } 

    changeLocation(uuid);

    setTimeout(() => {
      resetLocation(uuid)
    }, +RESET_PRODUCT_LOCATION_TIMEOUT_MS);
  }

  return (
    <div className={`product-lane ${classes}`}>
      {headerText && <div className="product-lane__header">
        <h2>{headerText}</h2>
      </div>}
      <div className="product-lane__body">
        <ProductButtonList onClick={onClick} items={products} />
      </div>
    </div>
  );
}