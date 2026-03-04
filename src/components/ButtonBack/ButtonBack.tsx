import style from "./ButtonBack.module.css";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function ButtonBack() {
  const navigate = useNavigate();
  return (
    <button
      className={style.button}
      type="button"
      aria-label="Voltar"
      onClick={() => navigate(-1)}
    >
      <ChevronLeft />
    </button>
  );
}
