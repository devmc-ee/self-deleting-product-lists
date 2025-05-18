import type { FC } from "react";
import type { Product, UUID } from "../core/types";

interface ButtonListProps {
  items: Product[];
  onClick: (uuid: UUID) => void
}

export const ProductButtonList: FC<ButtonListProps> = ({
  items, onClick
}) => items.map(({ uuid, name }) => (
  <button className="product-button" onClick={() => onClick(uuid)} key={uuid}>{name}</button>
))