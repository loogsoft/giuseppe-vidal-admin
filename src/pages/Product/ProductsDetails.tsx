import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import { ProductCategoryEnum } from "../../dtos/enums/product-category.enum";
import { ProductStatusEnum } from "../../dtos/enums/product-status.enum";
import { ProductService } from "../../service/Product.service";
import type { ProductRequest } from "../../dtos/request/product-request.dto";

export function ProductsDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProductCategoryEnum>(
    ProductCategoryEnum.SHIRT,
  );
  const [status, setStatus] = useState<ProductStatusEnum>(
    ProductStatusEnum.ACTIVED,
  );
  const [price, setPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [stockEnabled, setStockEnabled] = useState(true);
  const [stock, setStock] = useState("");
  const [variations, setVariations] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const categoryOptions = useMemo(
    () => Object.values(ProductCategoryEnum),
    [],
  );
  const statusOptions = useMemo(() => Object.values(ProductStatusEnum), []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!isEdit || !id) {
        onClearForm();
        return;
      }

      const data = await ProductService.findOne(id);
      setName(data.name ?? "");
      setDescription(data.description ?? "");
      setCategory(data.category ?? ProductCategoryEnum.SHIRT);
      setStatus(data.isActive ?? ProductStatusEnum.ACTIVED);
      setPrice(data.price ? String(data.price).replace(".", ",") : "");
      setPromoPrice(
        data.promoPrice ? String(data.promoPrice).replace(".", ",") : "",
      );
      setStockEnabled(!!data.stockEnabled);
      setStock(String(data.stock ?? ""));
      setImageNames((data.images || []).map((img) => img.fileName));
      setImageFiles([]);
    };

    loadProduct();
  }, [id, isEdit]);

  const onPickImages = () => {
    fileInputRef.current?.click();
  };

  const onImagesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setImageNames(files.map((file) => file.name));
    setImageFiles(files);
    event.target.value = "";
  };

  const onClearForm = () => {
    setName("");
    setDescription("");
    setCategory(ProductCategoryEnum.SHIRT);
    setStatus(ProductStatusEnum.ACTIVED);
    setPrice("");
    setPromoPrice("");
    setStockEnabled(true);
    setStock("");
    setVariations("");
    setSupplierId("");
    setSupplierName("");
    setSupplierEmail("");
    setSupplierPhone("");
    setImageNames([]);
    setImageFiles([]);
  };

  const toDot = (value: string) => value.replace(/\./g, "").replace(",", ".").trim();

  const parseVariations = () => {
    const trimmed = variations.trim();
    if (!trimmed) return undefined;
    try {
      return JSON.parse(trimmed);
    } catch {
      return undefined;
    }
  };

  const onSave = async () => {
    if (saving) return;

    const payload: ProductRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      status,
      price: Number(toDot(price || "0")),
      promoPrice: promoPrice.trim() ? Number(toDot(promoPrice)) : undefined,
      isActiveStock: stockEnabled,
      stock: stockEnabled ? Number(stock || 0) : 0,
      variations: parseVariations(),
      supplier: {
        name: supplierName.trim(),
        email: supplierEmail.trim() || undefined,
        phone: supplierPhone.trim() || undefined,
      },
      supplierId: supplierId.trim(),
    };

    try {
      setSaving(true);
      if (isEdit && id) {
        await ProductService.update(id, payload);
        navigate(-1);
        return;
      }

      await ProductService.create(payload, imageFiles);
      navigate(-1);
    } finally {
      setSaving(false);
    }
  };

  const imageLabel = imageNames.length
    ? `${imageNames.length} imagem(s) selecionada(s)`
    : "Clique para enviar";
  const actionLabel = isEdit ? "Salvar alteracoes" : "Criar produto";
  const loadingLabel = isEdit ? "Salvando..." : "Criando...";

  return (
    <div className={styles.page}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={onImagesSelected}
      />

      <div className={styles.top}>
        <div>
          <h1 className={styles.title}>
            {isEdit ? "Editar produto" : "Cadastro de novo produto"}
          </h1>
          <p className={styles.subtitle}>
            {isEdit
              ? "Atualize as informacoes principais do produto."
              : "Preencha as informacoes principais do produto."}
          </p>
        </div>

        <div className={styles.topActions}>
          <button
            className={styles.discard}
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button
            className={styles.save}
            type="button"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? <span className={styles.spinner} /> : null}
            {saving ? loadingLabel : actionLabel}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <aside className={styles.logoCard}>
          <div className={styles.logoTitle}>Fotos do produto</div>
          <button
            className={styles.logoUpload}
            type="button"
            onClick={onPickImages}
          >
            <div className={styles.logoIcon}>+</div>
            <div className={styles.logoText}>{imageLabel}</div>
            <div className={styles.logoHint}>PNG ou JPG (max. 5MB)</div>
          </button>
          <p className={styles.logoTip}>
            Dica: use imagens com boa resolucao para identificar o produto.
          </p>
        </aside>

        <div className={styles.formColumn}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelNumber}>1</span>
              <span className={styles.panelTitle}>Informacoes do produto</span>
            </div>

            <div className={styles.form}>
              <label className={styles.field}>
                <span className={styles.label}>Nome</span>
                <input
                  className={styles.input}
                  placeholder="Ex: Camisa social"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Descricao</span>
                <textarea
                  className={styles.textarea}
                  placeholder="Descreva o produto"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>

              <div className={styles.row2}>
                <label className={styles.field}>
                  <span className={styles.label}>Categoria</span>
                  <select
                    className={styles.select}
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value as ProductCategoryEnum)
                    }
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Status</span>
                  <select
                    className={styles.select}
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as ProductStatusEnum)
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>Fornecedor</span>
                <input
                  className={styles.input}
                  placeholder="Nome do fornecedor"
                  value={supplierName}
                  onChange={(event) => setSupplierName(event.target.value)}
                />
              </label>

              <div className={styles.row2}>
                <label className={styles.field}>
                  <span className={styles.label}>Email do fornecedor</span>
                  <input
                    className={styles.input}
                    placeholder="contato@fornecedor.com.br"
                    value={supplierEmail}
                    onChange={(event) => setSupplierEmail(event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Telefone do fornecedor</span>
                  <input
                    className={styles.input}
                    placeholder="(00) 00000-0000"
                    value={supplierPhone}
                    onChange={(event) => setSupplierPhone(event.target.value)}
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>ID do fornecedor</span>
                <input
                  className={styles.input}
                  placeholder="Informe o ID do fornecedor"
                  value={supplierId}
                  onChange={(event) => setSupplierId(event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelNumber}>2</span>
              <span className={styles.panelTitle}>Precificacao</span>
            </div>

            <div className={styles.form}>
              <div className={styles.row2}>
                <label className={styles.field}>
                  <span className={styles.label}>Preco</span>
                  <input
                    className={styles.input}
                    placeholder="0,00"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Preco promocional</span>
                  <input
                    className={styles.input}
                    placeholder="0,00"
                    value={promoPrice}
                    onChange={(event) => setPromoPrice(event.target.value)}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelNumber}>3</span>
              <span className={styles.panelTitle}>Estoque e variacoes</span>
            </div>

            <div className={styles.form}>
              <div className={styles.row2}>
                <label className={styles.field}>
                  <span className={styles.label}>Controle de estoque</span>
                  <select
                    className={styles.select}
                    value={stockEnabled ? "true" : "false"}
                    onChange={(event) =>
                      setStockEnabled(event.target.value === "true")
                    }
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Desativado</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Quantidade</span>
                  <input
                    className={styles.input}
                    placeholder="0"
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>Variacoes</span>
                <textarea
                  className={styles.textarea}
                  placeholder="Ex: Tamanho, sabor, adicionais"
                  value={variations}
                  onChange={(event) => setVariations(event.target.value)}
                />
              </label>
            </div>
          </section>

          <div className={styles.bottomActions}>
            <button
              className={styles.clear}
              type="button"
              onClick={onClearForm}
            >
              Limpar formulario
            </button>
            <button
              className={styles.save}
              type="button"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? <span className={styles.spinner} /> : null}
              {saving ? loadingLabel : actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
