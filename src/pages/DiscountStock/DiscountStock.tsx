import { useEffect, useMemo, useState } from "react";
import styles from "./DiscountStock.module.css";
import { FiClock, FiFilter, FiSearch, FiTag, FiTrendingDown } from "react-icons/fi";
import StatCard from "../../components/StatCard/StatCard";
import { CustomSelect } from "../../components/CustomSelect/CustomSelect";
import { DiscountStockFilterModal } from "../../components/DiscountStockFilterModal";

type StockLevel = "all" | "ok" | "low" | "critical";
type SortOption = "alpha" | "priceAsc" | "priceDesc" | "stockAsc" | "stockDesc";

type StockItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  level: "ok" | "low" | "critical";
};

type StockHistory = {
  id: string;
  date: string;
  time: string;
  product: string;
  quantity: number;
  reason: "Venda" | "Avaria" | "Consumo";
  owner: string;
};

const STOCK_ITEMS: StockItem[] = [
  {
    id: "s1",
    name: "Pinha Premium Grande",
    sku: "SKU-921",
    category: "Frutas de epoca",
    stock: 85,
    unit: "un",
    price: 24.9,
    level: "ok",
  },
  {
    id: "s2",
    name: "Cesta Decorativa Rustica",
    sku: "SKU-511",
    category: "Acessorios",
    stock: 12,
    unit: "un",
    price: 89.9,
    level: "low",
  },
  {
    id: "s3",
    name: "Pinha Pequena (Saco 500g)",
    sku: "SKU-517",
    category: "Frutas de epoca",
    stock: 4,
    unit: "un",
    price: 12.5,
    level: "critical",
  },
  {
    id: "s4",
    name: "Extrato de Pinha Organico",
    sku: "SKU-477",
    category: "Processados",
    stock: 42,
    unit: "un",
    price: 18.9,
    level: "ok",
  },
  {
    id: "s5",
    name: "Pinha Premium Media",
    sku: "SKU-204",
    category: "Frutas de epoca",
    stock: 35,
    unit: "un",
    price: 19.9,
    level: "ok",
  },
  {
    id: "s6",
    name: "Cesta Presenteavel",
    sku: "SKU-812",
    category: "Acessorios",
    stock: 9,
    unit: "un",
    price: 74.5,
    level: "low",
  },
];

const STOCK_HISTORY: StockHistory[] = [
  {
    id: "h1",
    date: "24/05/2024",
    time: "12:15",
    product: "Pinha Premium Grande",
    quantity: 5,
    reason: "Venda",
    owner: "Ricardo Silva",
  },
  {
    id: "h2",
    date: "24/05/2024",
    time: "11:30",
    product: "Cesta Decorativa Rustica",
    quantity: 2,
    reason: "Avaria",
    owner: "Ana Paula",
  },
  {
    id: "h3",
    date: "23/05/2024",
    time: "17:45",
    product: "Pinha Pequena (Saco 500g)",
    quantity: 12,
    reason: "Venda",
    owner: "Ricardo Silva",
  },
  {
    id: "h4",
    date: "23/05/2024",
    time: "10:30",
    product: "Extrato de Pinha Organico",
    quantity: 1,
    reason: "Consumo",
    owner: "Gerencia",
  },
];

export function DiscountStock() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"stock" | "history">("stock");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    minPrice: string;
    maxPrice: string;
    minStock: string;
    maxStock: string;
    stockLevel: StockLevel;
    sortBy: SortOption;
  }>({
    minPrice: "",
    maxPrice: "",
    minStock: "",
    maxStock: "",
    stockLevel: "all",
    sortBy: "alpha",
  });
  const totalItems = STOCK_ITEMS.length;
  const totalOut = 142;

  const LISTPAG: { value: number }[] = useMemo(
    () => [{ value: 6 }, { value: 12 }, { value: 24 }, { value: 48 }],
    [],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    STOCK_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(STOCK_ITEMS.map((item) => item.category))).sort();
    return [
      { value: "all", label: `Todos ${STOCK_ITEMS.length}` },
      ...unique.map((cat) => ({
        value: cat,
        label: cat,
      })),
    ];
  }, [categoryCounts]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    let filtered = STOCK_ITEMS.filter((item) => {
      const matchesSearch = term
        ? `${item.name} ${item.sku} ${item.category}`
            .toLowerCase()
            .includes(term)
        : true;
      const matchesCategory =
        category === "all" ? true : item.category === category;
      
      const matchesPrice = 
        (!filters.minPrice || item.price >= Number(filters.minPrice)) &&
        (!filters.maxPrice || item.price <= Number(filters.maxPrice));
       
      const matchesStock =
        (!filters.minStock || item.stock >= Number(filters.minStock)) &&
        (!filters.maxStock || item.stock <= Number(filters.maxStock));
      
      const matchesLevel = 
        filters.stockLevel === "all" || item.level === filters.stockLevel;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesLevel;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (filters.sortBy === "priceAsc") {
        return a.price - b.price;
      }
      if (filters.sortBy === "priceDesc") {
        return b.price - a.price;
      }
      if (filters.sortBy === "stockAsc") {
        return a.stock - b.stock;
      }
      if (filters.sortBy === "stockDesc") {
        return b.stock - a.stock;
      }
      return a.name.localeCompare(b.name, "pt-BR");
    });

    return sorted;
  }, [search, category, filters]);

  const filteredHistory = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return STOCK_HISTORY;
    }

    return STOCK_HISTORY.filter((item) => {
      const haystack =
        `${item.product} ${item.reason} ${item.owner}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [view, search, category, filters]);

  const totalResults =
    view === "stock" ? filteredItems.length : filteredHistory.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedStockItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage]);

  const pagedHistoryItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, currentPage]);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dar baixa no estoque</h1>
          <p className={styles.subtitle}>
            Registre saidas, ajuste quantidades e acompanhe o historico.
          </p>
        </div>
        <div className={styles.headerMeta}>
          <div className={styles.date}>Seg, 09 Fev 2026</div>
          <button className={styles.primaryBtn} type="button">
            Baixa manual
          </button>
        </div>
      </header>

      <section className={styles.metrics}>
        <StatCard
          label="Itens pendentes"
          value={totalItems}
          sub="Produtos com baixa"
          icon={<FiClock />}
        />
        <StatCard
          label="Total saida (hoje)"
          value={`${totalOut} un`}
          sub="Ultimas 24h"
          icon={<FiTrendingDown />}
        />
        <StatCard
          label="Motivo mais comum"
          value="Venda Manual"
          sub="Ultimas 24h"
          icon={<FiTag />}
        />
      </section>

      <section className={styles.tabs}>
        <button
          className={`${styles.tab} ${view === "stock" ? styles.tabActive : ""}`}
          type="button"
          onClick={() => setView("stock")}
        >
          Produtos em estoque
        </button>
        <button
          className={`${styles.tab} ${view === "history" ? styles.tabActive : ""}`}
          type="button"
          onClick={() => setView("history")}
        >
          Historico de baixas
        </button>
      </section>

      {view === "stock" ? (
        <section className={styles.tablePanel}>
          <div className={styles.filters}>
            <div style={{display:"flex", gap:"10px"}}>
              <div className={styles.search}>
                <FiSearch className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Buscar produto, SKU ou categoria..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <CustomSelect
                options={LISTPAG.map((c) => ({ value: String(c.value), label: String(c.value) }))}
                value={String(pageSize)}
                onChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              />
            </div>
            <div className={styles.filterActions}>
              <CustomSelect
                options={categories}
                value={category}
                onChange={(value) => setCategory(value)}
              />
              <div style={{ position: "relative" }}>
                <button
                  className={styles.filterBtn}
                  type="button"
                  onClick={() => setIsFilterModalOpen(true)}
                >
                  <FiFilter />
                  Filtros
                </button>
                <DiscountStockFilterModal
                  isOpen={isFilterModalOpen}
                  onClose={() => setIsFilterModalOpen(false)}
                  onApply={(newFilters) => {
                    setFilters(newFilters);
                    setPage(1);
                  }}
                  initialFilters={filters}
                />
              </div>
            </div>
          </div>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Produto</span>
              <span>Categoria</span>
              <span>Estoque atual</span>
              <span>Acao</span>
            </div>
            <div className={styles.tableBody}>
              {pagedStockItems.map((item) => (
                <div className={styles.row} key={item.id}>
                  <div className={styles.productCol}>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productSku}>SKU: {item.sku}</div>
                  </div>
                  <div className={styles.categoryCol}>{item.category}</div>
                  <div className={styles.stockCol}>
                    <span
                      className={`${styles.stockPill} ${
                        item.level === "critical"
                          ? styles.stockCritical
                          : item.level === "low"
                            ? styles.stockLow
                            : styles.stockOk
                      }`}
                    >
                      {item.stock} {item.unit}
                    </span>
                  </div>
                  <div className={styles.actionCol}>
                    <button className={styles.actionBtn} type="button">
                      Dar baixa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.tableFooter}>
            <div className={styles.tableSummary}>
              Mostrando {pagedStockItems.length} de {totalResults} produtos
            </div>
            <div className={styles.pagination}>
              <button
                className={`${styles.pageBtn} ${
                  currentPage === 1 ? styles.pageBtnDisabled : ""
                }`}
                type="button"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Pagina anterior"
              >
                ‹
              </button>
              {pages.map((p) => (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${
                    p === currentPage ? styles.pageBtnActive : ""
                  }`}
                  type="button"
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className={`${styles.pageBtn} ${
                  currentPage === totalPages ? styles.pageBtnDisabled : ""
                }`}
                type="button"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Proxima pagina"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.tablePanel}>
          <div className={styles.filters}>
            <div style={{display:"flex", gap:"10px"}}>
              <div className={styles.search}>
                <FiSearch className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Buscar no historico..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <CustomSelect
                options={LISTPAG.map((c) => ({ value: String(c.value), label: String(c.value) }))}
                value={String(pageSize)}
                onChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              />
            </div>
            <div className={styles.filterActions}>
              <CustomSelect
                options={[
                  { value: "period", label: "Periodo" },
                  { value: "7", label: "Últimos 7 dias" },
                  { value: "30", label: "Últimos 30 dias" },
                ]}
                value="period"
                onChange={() => {}}
              />
              <CustomSelect
                options={[
                  { value: "reason", label: "Motivo" },
                  { value: "Venda", label: "Venda" },
                  { value: "Avaria", label: "Avaria" },
                  { value: "Consumo", label: "Consumo" },
                ]}
                value="reason"
                onChange={() => {}}
              />
            </div>
          </div>
          <div className={styles.table}>
            <div
              className={`${styles.tableHeader} ${styles.tableHeaderHistory}`}
            >
              <span>Data/Hora</span>
              <span>Produto</span>
              <span>Qtd. retirada</span>
              <span>Motivo</span>
              <span>Responsavel</span>
              <span>Acao</span>
            </div>
            <div className={styles.tableBody}>
              {pagedHistoryItems.map((item) => (
                <div
                  className={`${styles.row} ${styles.rowHistory}`}
                  key={item.id}
                >
                  <div className={styles.dateCol}>
                    <div>{item.date}</div>
                    <div className={styles.muted}>{item.time}</div>
                  </div>
                  <div className={styles.productCol}>
                    <div className={styles.productName}>{item.product}</div>
                    <div className={styles.productSku}>SKU: {item.id}</div>
                  </div>
                  <div className={styles.qtyCol}>{item.quantity} un</div>
                  <div className={styles.reasonCol}>
                    <span
                      className={`${styles.reasonPill} ${
                        item.reason === "Venda"
                          ? styles.reasonSale
                          : item.reason === "Avaria"
                            ? styles.reasonDamage
                            : styles.reasonInternal
                      }`}
                    >
                      {item.reason}
                    </span>
                  </div>
                  <div className={styles.ownerCol}>{item.owner}</div>
                  <div className={styles.actionCol}>
                    <button className={styles.actionOutlineBtn} type="button">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.tableFooter}>
            <div className={styles.tableSummary}>
              Mostrando {pagedHistoryItems.length} de {totalResults} baixas
            </div>
            <div className={styles.pagination}>
              <button
                className={`${styles.pageBtn} ${
                  currentPage === 1 ? styles.pageBtnDisabled : ""
                }`}
                type="button"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Pagina anterior"
              >
                ‹
              </button>
              {pages.map((p) => (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${
                    p === currentPage ? styles.pageBtnActive : ""
                  }`}
                  type="button"
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className={`${styles.pageBtn} ${
                  currentPage === totalPages ? styles.pageBtnDisabled : ""
                }`}
                type="button"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Proxima pagina"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
