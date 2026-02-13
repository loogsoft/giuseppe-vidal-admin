import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiGrid,
  FiPackage,
  FiPlus,
  FiSearch,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { Plus } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { SkeletonCard } from "../../components/SkeletonCard";
import styles from "./Supplier.module.css";
import { SupplierService } from "../../service/Supplier.service";
import type { SupplierResponseDto } from "../../dtos/response/supplier-response.dto";
import StatCard from "../../components/StatCard/StatCard";

type SupplierStatus = "active" | "inactive";

type SupplierCardData = {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  status: SupplierStatus;
  initials: string;
  avatarColor: string;
  openDiscountStock: number;
};

const AVATAR_COLORS = ["#fff1d6", "#e7e7e7", "#ffe5e5", "#fff0d9", "#e9f1ff", "#eee3ff"];

const getInitials = (name: string) => {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) return "--";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const normalizeStatus = (value: unknown): SupplierStatus => {
  if (value === true) return "active";
  if (value === false) return "inactive";
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["active", "ativo", "actived", "enabled"].includes(normalized)) {
      return "active";
    }
    if (["inactive", "inativo", "disabled"].includes(normalized)) {
      return "inactive";
    }
  }
  return "active";
};

const resolveLocation = (item: SupplierResponseDto) => {
  if (typeof item.location === "string" && item.location.trim()) {
    return item.location;
  }

  return "-";
};

const mapSupplierCard = (
  item: SupplierResponseDto,
  index: number,
): SupplierCardData => {
  const name = String(item.name ?? "Fornecedor");
  return {
    id: String(item.id ?? index),
    name,
    category: String(item.category ?? "Geral"),
    email: String(item.email ?? "-"),
    phone: String(item.phone ?? "-"),
    location: resolveLocation(item),
    status: normalizeStatus(item.status),
    initials: getInitials(name),
    avatarColor: String(item.avatarColor ?? AVATAR_COLORS[index % AVATAR_COLORS.length]),
    openDiscountStock: Number(item.openDiscountStock ?? 0),
  };
};

export function Supplier() {
  const [activeCat, setActiveCat] = useState("all");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<SupplierCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const categories = useMemo(() => {
    const unique = Array.from(new Set(suppliers.map((s) => s.category)));
    return ["all", ...unique];
  }, [suppliers]);

  const filtered = useMemo(() => {
    let current = suppliers;
    if (activeCat !== "all") {
      current = current.filter((s) => s.category === activeCat);
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return current;
    return current.filter((s) =>
      [s.name, s.email, s.phone, s.location]
        .join(" ")
        .toLowerCase()
        .includes(trimmed),
    );
  }, [activeCat, query, suppliers]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await SupplierService.findAll();
        const list = Array.isArray(data) ? data : data.data ?? [];
        setSuppliers(list.map(mapSupplierCard));
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar fornecedores");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (deletingId) return;

    const confirmed = window.confirm("Deseja excluir este fornecedor?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await SupplierService.remove(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir fornecedor");
    } finally {
      setDeletingId(null);
    }
  };

  const pageSize = 6;
  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, maxPage);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === "active").length;
  const openDiscountStock = suppliers.reduce(
    (sum, s) => sum + s.openDiscountStock,
    0,
  );
  const categoriesTotal = new Set(suppliers.map((s) => s.category)).size;


  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestao de Fornecedores</h1>
          <p className={styles.subtitle}>
            Centralize contatos, categorias e desempenho dos seus fornecedores.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.addBtn}
            type="button"
            onClick={() => navigate("/supplier-details")}
          >
            <Plus size={16} />
            Cadastrar Fornecedor
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <StatCard
          label="TOTAL DE FORNECEDORES"
          value={totalSuppliers.toLocaleString("pt-BR")}
          icon={<FiUsers />}
        />
        <StatCard
          label="FORNECEDORES ATIVOS"
          value={activeSuppliers.toLocaleString("pt-BR")}
          icon={<FiUserCheck />}
        />
        <StatCard
          label="BAIXAS EM ABERTO"
          value={openDiscountStock}
          icon={<FiPackage />}
        />
        <StatCard
          label="CATEGORIAS"
          value={categoriesTotal}
          icon={<FiGrid />}
        />
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.filters}>
          <div className={styles.search}>
            <FiSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar fornecedores..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div style={{ padding: 12 }}>{error}</div>
        ) : (
          <div className={styles.grid}>
            {paginated.map((supplier) => (
              <ProductCard
                key={supplier.id}
                type="supplier"
                id={supplier.id}
                name={supplier.name}
                category={supplier.category}
                email={supplier.email}
                phone={supplier.phone}
                location={supplier.location}
                isActive={supplier.status === "active"}
                initials={supplier.initials}
                avatarColor={supplier.avatarColor}
                onEdit={(id) => navigate(`/supplier-details/${id}`)}
                onDelete={(id) => handleDelete(id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        <div className={styles.counter}>
          Exibindo {paginated.length} de {total} fornecedores cadastrados
        </div>

        <div className={styles.pager}>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Anterior"
            disabled={currentPage <= 1}
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            aria-label="Proximo"
            disabled={currentPage >= maxPage}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <button
        className={styles.fab}
        type="button"
        aria-label="Adicionar fornecedor"
        onClick={() => navigate("/supplier-details")}
      >
        <FiPlus />
      </button>
    </div>
  );
}
