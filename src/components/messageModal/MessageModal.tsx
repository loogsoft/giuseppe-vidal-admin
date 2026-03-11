import { createPortal } from "react-dom";
import {
  FiAlertTriangle,
  FiChevronDown,
  FiChevronUp,
  FiX,
} from "react-icons/fi";
import style from "./MessageModal.module.css";
import { useState } from "react";

type Message = {
  id: number;
  productName: string;
  imageUrl: string;
  text: string;
  read: boolean;
};

type MessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

export function MessageModal({
  isOpen,
  onClose,
  title = "Mensagens",
}: MessageModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      productName: "Camiseta Azul",
      imageUrl: "https://placehold.co/60x60?text=Camisa",
      text: "Está com estoque baixo! Restam apenas 2 unidades em estoque. Realize a reposição para evitar ruptura.",
      read: false,
    },
    {
      id: 2,
      productName: "Shorts Preto",
      imageUrl: "https://placehold.co/60x60?text=Shorts",
      text: "Atingiu o limite mínimo de estoque. Quantidade atual abaixo do mínimo configurado. Verifique com o fornecedor.",
      read: false,
    },
    {
      id: 3,
      productName: "Jaqueta Vermelha",
      imageUrl: "https://placehold.co/60x60?text=Jaqueta",
      text: "Está zerado. Não há mais unidades disponíveis em estoque. É necessário repor o produto imediatamente.",
      read: true,
    },
  ]);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
    );
  };

  return createPortal(
    <div className={style.backdrop} onClick={onClose}>
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        <div className={style.header}>
          <div className={style.headerLeft}>
            <span className={style.title}>{title}</span>
            {unreadCount > 0 && (
              <span className={style.unreadBadge}>{unreadCount}</span>
            )}
          </div>
          <button className={style.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className={style.content}>
          {messages.length === 0 ? (
            <div className={style.empty}>Nenhuma mensagem.</div>
          ) : (
            <div className={style.list}>
              {messages.map((msg) => {
                const isExpanded = expandedId === msg.id;
                return (
                  <div
                    key={msg.id}
                    className={`${style.card} ${!msg.read ? style.cardUnread : ""}`}
                    onClick={() => handleToggle(msg.id)}
                  >
                    <div className={style.cardTop}>
                      <div className={style.cardLeft}>
                        <div className={style.cardMeta}>
                          <FiAlertTriangle className={style.cardIconInline} />
                          <span className={style.productName}>
                            {msg.productName}
                          </span>
                          {!msg.read && <span className={style.dot} />}
                        </div>
                        <p
                          className={`${style.cardText} ${isExpanded ? style.cardTextExpanded : ""}`}
                        >
                          {msg.text}
                        </p>
                        <span className={style.chevron}>
                          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      </div>
                      <img
                        src={msg.imageUrl}
                        alt={msg.productName}
                        className={style.productImg}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
