import styles from "./DrinkCard.module.css";

type DrinkCardProps = {
  name: string;
  price: string;
  img: string;
  onAdd?: () => void;
};

export function DrinkCard({ name, price, img, onAdd }: DrinkCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imgWrap}>
        <img src={img} alt={name} className={styles.img} />
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.price}>{price}</div>
      </div>

      <button className={styles.plus} onClick={onAdd}>
        +
      </button>
    </article>
  );
}
