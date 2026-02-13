import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";
import {
  FiBox,
  FiDollarSign,
  FiEdit2,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiTrash2,
} from "react-icons/fi";
import { GiTrousers, GiTShirt } from "react-icons/gi";
import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { ProductCategoryEnum } from "../dtos/enums/product-category.enum";
import type { ImageResponse } from "../dtos/response/image-response.dto";
import { ProductStatusEnum } from "../dtos/enums/product-status.enum";

type BaseProps = {
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

type ProductProps = BaseProps & {
  type?: "product";
  name: string;
  description: string | undefined;
  category: ProductCategoryEnum;
  price: string;
  imageUrl: ImageResponse[];
  stock: number | undefined;
  stockEnabled: boolean;
  available: boolean;
  onToggleAvailable?: (id: string) => void;
  navigateTo: string;
  isActive: ProductStatusEnum;
};

type SupplierProps = BaseProps & {
  type: "supplier";
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  isActive: boolean;
  initials: string;
  avatarColor?: string;
};

type Props = ProductProps | SupplierProps;

function currencyBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getProductIcon = (value: string) => {
  const normalized = normalizeText(value);
  if (normalized.includes("camiseta") || normalized.includes("camisa")) {
    return <GiTShirt />;
  }
  if (normalized.includes("calca") || normalized.includes("pants")) {
    return <GiTrousers />;
  }
  return <FiPackage />;
};

export default function ProductCard(props: Props) {
  const navigate = useNavigate();
  const status =
    props.type === "supplier" ? ProductStatusEnum.ACTIVED : props.isActive;

  const supplierAvatarStyle = useMemo(() => {
    if (props.type !== "supplier") return undefined;
    return { backgroundColor: props.avatarColor } as CSSProperties;
  }, [props.avatarColor, props.type]);

  if (props.type === "supplier") {
    const statusLabel = props.isActive ? "ATIVO" : "INATIVO";
    return (
      <div className={`${styles.card} ${styles.supplierCard}`}>
        <div className={`${styles.media} ${styles.supplierMedia}`}>
          <div
            className={`${styles.avatar} ${styles.supplierAvatar}`}
            style={supplierAvatarStyle}
          >
            <span className={styles.avatarText}>{props.initials}</span>
          </div>

          <div className={styles.cardActions}>
            <button
              className={styles.iconBtn}
              type="button"
              aria-label="Editar"
              onClick={() => props.onEdit?.(props.id)}
            >
              <FiEdit2 />
            </button>
            <button
              className={styles.iconBtn}
              type="button"
              aria-label="Excluir"
              onClick={() => props.onDelete?.(props.id)}
            >
              <FiTrash2 />
            </button>
          </div>
        </div>

        <div className={`${styles.body} ${styles.supplierBody}`}>
          <div
            className={`${styles.statusBadge} ${styles.supplierStatus} ${
              props.isActive ? styles.statusActive : styles.statusInactive
            }`}
          >
            {statusLabel}
          </div>
          <div className={styles.name}>{props.name}</div>
          <div className={`${styles.category} ${styles.supplierCategory}`}>
            {props.category}
          </div>

          <div className={styles.supplierMeta}>
            <div className={styles.metaItem}>
              <FiMail className={styles.metaIcon} />
              {props.email}
            </div>
            <div className={styles.metaItem}>
              <FiPhone className={styles.metaIcon} />
              {props.phone}
            </div>
            <div className={styles.metaItem}>
              <FiMapPin className={styles.metaIcon} />
              {props.location}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusLabel =
    status === ProductStatusEnum.ACTIVED ? "ATIVO" : "INATIVO";
  const productIcon = getProductIcon(`${props.name} ${props.category}`);

  return (
    <div className={`${styles.card} ${styles.productCard}`}>
      <div className={`${styles.media} ${styles.productMedia}`}>
        <div className={`${styles.avatar} ${styles.productAvatar}`}>
          <span className={styles.productIcon}>{productIcon}</span>
        </div>

        <div className={styles.cardActions}>
          <button
            className={styles.iconBtn}
            type="button"
            aria-label="Editar"
            onClick={() => navigate(`/product-details/${props.id}`)}
          >
            <FiEdit2 />
          </button>
          <button
            className={styles.iconBtn}
            type="button"
            aria-label="Excluir"
            onClick={() => props.onDelete?.(props.id)}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <div
          className={`${styles.statusBadge} ${styles.supplierStatus} ${
            status === ProductStatusEnum.ACTIVED
              ? styles.statusActive
              : styles.statusInactive
          }`}
        >
          {statusLabel}
        </div>
        <div className={styles.name}>{props.name}</div>
        <div className={`${styles.category} ${styles.productCategory}`}>
          {props.category}
        </div>

        <div className={styles.productMeta}>
          <div className={styles.metaItem}>
            <FiDollarSign className={styles.metaIcon} />
            {currencyBRL(Number(props.price))}
          </div>
          <div className={styles.metaItem}>
            <FiBox className={styles.metaIcon} />
            {props.stockEnabled ? `Estoque: ${props.stock ?? 0}` : "Estoque desativado"}
          </div>
        </div>

        {!status ? <div className={styles.outOfStock}>SEM ESTOQUE</div> : null}
      </div>
    </div>
  );
}
