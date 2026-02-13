import styles from "./Product.module.css";
import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiBox,
  FiDollarSign,
  FiFilter,
  FiGrid,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import ProductCard from "../../components/ProductCard";
import { SkeletonCard } from "../../components/SkeletonCard";
import { FilterModal } from "../../components/FilterModal";
import { Plus } from "lucide-react";
import type { CategoryKey } from "../../types/Product-type";
import { ProductService } from "../../service/Product.service";
import type { ProductResponse } from "../../dtos/response/product-response.dto";
import { ProductCategoryEnum } from "../../dtos/enums/product-category.enum";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/StatCard/StatCard";

type SortOption = "price-asc" | "price-desc" | "name-asc" | null;

export function Products() {
  const [activeCat, setActiveCat] = useState<CategoryKey>("all");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    minPrice: string;
    maxPrice: string;
    category: CategoryKey;
    sortBy: SortOption;
  }>({
    minPrice: "",
    maxPrice: "",
    category: "all",
    sortBy: null,
  });
  const categoryFromKey = (key: CategoryKey) => {
    switch (key) {
      case "shirt":
        return ProductCategoryEnum.SHIRT;
      case "tshirt":
        return ProductCategoryEnum.TSHIRT;
      case "polo":
        return ProductCategoryEnum.POLO;
      case "shorts":
        return ProductCategoryEnum.SHORTS;
      case "jacket":
        return ProductCategoryEnum.JACKET;
      case "pants":
        return ProductCategoryEnum.PANTS;
      case "dress":
        return ProductCategoryEnum.DRESS;
      case "sweater":
        return ProductCategoryEnum.SWEATER;
      case "hoodie":
        return ProductCategoryEnum.HOODIE;
      case "underwear":
        return ProductCategoryEnum.UNDERWEAR;
      case "footwear":
        return ProductCategoryEnum.FOOTWEAR;
      case "belt":
        return ProductCategoryEnum.BELT;
      case "wallet":
        return ProductCategoryEnum.WALLET;
      case "sunglasses":
        return ProductCategoryEnum.SUNGLASSES;
      default:
        return null;
    }
  };

  const filtered = useMemo(() => {
    let current = products;
    
    // Filtro de categoria (select ou modal)
    const categoryToFilter = filters.category !== "all" ? filters.category : activeCat;
    if (categoryToFilter !== "all") {
      const category = categoryFromKey(categoryToFilter);
      if (category) {
        current = current.filter((p) => p.category === category);
      }
    }

    // Filtro de busca
    const trimmed = query.trim().toLowerCase();
    if (trimmed) {
      current = current.filter((p) => p.name.toLowerCase().includes(trimmed));
    }

    // Filtro de preço
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      current = current.filter((p) => parseFloat(p.price) >= min);
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      current = current.filter((p) => parseFloat(p.price) <= max);
    }

    // Ordenação
    if (filters.sortBy === "price-asc") {
      current = [...current].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (filters.sortBy === "price-desc") {
      current = [...current].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (filters.sortBy === "name-asc") {
      current = [...current].sort((a, b) => a.name.localeCompare(b.name));
    }

    return current;
  }, [activeCat, products, query, filters]);

  const total = filtered.length;

  const counts = useMemo(() => {
    const countBy = (category: ProductCategoryEnum) =>
      products.filter((p) => p.category === category).length;

    return {
      all: products.length,
      shirt: countBy(ProductCategoryEnum.SHIRT),
      tshirt: countBy(ProductCategoryEnum.TSHIRT),
      polo: countBy(ProductCategoryEnum.POLO),
      shorts: countBy(ProductCategoryEnum.SHORTS),
      jacket: countBy(ProductCategoryEnum.JACKET),
      pants: countBy(ProductCategoryEnum.PANTS),
      dress: countBy(ProductCategoryEnum.DRESS),
      sweater: countBy(ProductCategoryEnum.SWEATER),
      hoodie: countBy(ProductCategoryEnum.HOODIE),
      underwear: countBy(ProductCategoryEnum.UNDERWEAR),
      footwear: countBy(ProductCategoryEnum.FOOTWEAR),
      belt: countBy(ProductCategoryEnum.BELT),
      wallet: countBy(ProductCategoryEnum.WALLET),
      sunglasses: countBy(ProductCategoryEnum.SUNGLASSES),
    };
  }, [products]);

  const CATEGORIES: { key: CategoryKey; label: string }[] = useMemo(
    () => [
      { key: "all", label: `Todos ${counts.all}` },
      { key: "shirt", label: "Camisa" },
      { key: "tshirt", label: "Camiseta" },
      { key: "polo", label: "Polo" },
      { key: "shorts", label: "Shorts" },
      { key: "jacket", label: "Jaqueta" },
      { key: "pants", label: "Calça" },
      { key: "dress", label: "Vestido" },
      { key: "sweater", label: "Suéter" },
      { key: "hoodie", label: "Moletom" },
      { key: "underwear", label: "Cueca" },
      { key: "footwear", label: "Calçado" },
      { key: "belt", label: "Cinto" },
      { key: "wallet", label: "Carteira" },
      { key: "sunglasses", label: "Óculos" },
    ],
    [counts],
  );

  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => sum + Number(p.price || 0), 0);
  }, [products]);

  const lowStock = useMemo(() => {
    return products.filter((p) => p.stockEnabled && (p.stock ?? 0) <= 5).length;
  }, [products]);

  const categoryTotal = useMemo(() => {
    return new Set(products.map((p) => p.category)).size;
  }, [products]);


  // const getPrimaryImageUrl = (images: ImageResponse[]) => {
  //   const primary = (images || []).find((img: any) => img?.isPrimary);
  //   return primary?.url || (images?.[0] as any)?.url || "";
  // };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProductService.findAll();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (deletingId) return;

    const confirmed = window.confirm("Deseja excluir este produto?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await ProductService.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir produto");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestao de Produtos</h1>
          <p className={styles.subtitle}>
            Organize seu catalogo, precos e niveis de estoque em um so lugar.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.addBtn}
            type="button"
            onClick={() => navigate("/product-details")}
          >
            <Plus size={16} />
            Cadastrar Produto
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <StatCard
          label="TOTAL DE PRODUTOS"
          value={counts.all.toLocaleString("pt-BR")}
          icon={<FiBox />}
        />
        <StatCard
          label="ESTOQUE BAIXO"
          value={lowStock}
          icon={<FiAlertTriangle />}
        />
        <StatCard
          label="VALOR TOTAL"
          value={totalValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={<FiDollarSign />}
        />
        <StatCard
          label="CATEGORIAS"
          value={categoryTotal}
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
              placeholder="Buscar produtos..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </div>

          <div className={styles.filterActions}>
            <select
              className={styles.categorySelect}
              value={activeCat}
              onChange={(event) => {
                setActiveCat(event.target.value as CategoryKey);
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
            <div style={{ position: 'relative' }}>
              <button 
                className={styles.filterBtn} 
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <FiFilter />
                Filtros
              </button>
              <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={(newFilters) => {
                  setFilters(newFilters);
                  setActiveCat(newFilters.category);
                }}
                categories={CATEGORIES}
                initialFilters={filters}
              />
            </div>
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
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                description={p.description}
                category={p.category}
                price={p.price}
                imageUrl={p.images}
                isActive={p.isActive}
                stockEnabled={p.stockEnabled}
                stock={p.stock}
                available
                onEdit={() => {}}
                onDelete={(id) => handleDelete(id)}
                onToggleAvailable={() => {}}
                navigateTo="/product-details"
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        <div className={styles.counter}>
          Exibindo {total} produtos cadastrados
        </div>
      </div>

      <button
        className={styles.fab}
        type="button"
        aria-label="Adicionar produto"
        onClick={() => navigate("/product-details")}
      >
        <FiPlus />
      </button>
    </div>
  );
}
