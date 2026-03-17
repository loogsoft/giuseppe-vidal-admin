import { useState, useRef, useEffect } from "react";
import { PrizesService } from "../../service/prizes.service";
import type { PrizeRequestDto } from "../../dtos/request/prize-request.dto";

type Product = {
  name: string;
  description: string;
  price: string;
  image: string;
  tag: string;
};

export default function RouletteAdmin() {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<PrizeRequestDto>>({});
    const handleEditClick = (idx: number) => {
      setEditingIndex(idx);
      setEditValues({ ...prizesBack[idx] });
    };

    const handleEditChange = (field: keyof PrizeRequestDto, value: any) => {
      setEditValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditCancel = () => {
      setEditingIndex(null);
      setEditValues({});
    };

    const handleEditSave = async () => {
      if (editingIndex === null) return;
      // Aqui você pode chamar o service de update se existir
      const updated = [...prizesBack];
      updated[editingIndex] = { ...updated[editingIndex], ...editValues };
      setPrizesBack(updated);
      setEditingIndex(null);
      setEditValues({});
      // Exemplo: await PrizesService.update(updated[editingIndex].id, editValues)
    };
  const [productTab, setProductTab] = useState<'create' | 'products'>('create');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [prizes, setPrizes] = useState<PrizeRequestDto[]>([]);
  const [prizesBack, setPrizesBack] = useState<PrizeRequestDto[]>([]);

  const [products, setProducts] = useState<Product[]>([
    {
      name: "Professional Camera",
      description: "Camera",
      price: "R$299",
      image:
        "https://images.unsplash.com/photo-1519183071298-a2962be96eec?w=200",
      tag: "PRODUCT",
    },
    {
      name: "Ultra Smartphone",
      description: "SMX",
      price: "R$999",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200",
      tag: "PRODUCT",
    },
    {
      name: "Bluetooth Headset",
      description: "PRO",
      price: "R$199",
      image:
        "https://images.unsplash.com/photo-1518441902110-7f7c37fdfb8b?w=200",
      tag: "PRODUCT",
    },
  ]);

  const size = 260;

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Usar prizesBack para a pré-visualização
    const previewList = prizesBack;
    const radius = size / 2;
    const arc = previewList.length > 0 ? (2 * Math.PI) / previewList.length : 0;

    ctx.clearRect(0, 0, size, size);

    previewList.forEach((prize, i) => {
      const angle = i * arc;

      ctx.beginPath();
      ctx.fillStyle = i % 2 === 0 ? "#FFC107" : "#000";
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, angle, angle + arc);
      ctx.fill();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angle + arc / 2);
      ctx.fillStyle = i % 2 === 0 ? "#000" : "#fff";
      ctx.font = "bold 14px Inter";
      ctx.textAlign = "right";
      ctx.fillText(prize.name, radius - 10, 5);
      ctx.restore();
    });
  };

  useEffect(() => {
    drawWheel();
  }, [prizesBack]);

  useEffect(() => {
    const fetchPrizes = async () => {
      const data = await PrizesService.findAll();
      setPrizesBack(Array.isArray(data) ? data : []);
    };
    fetchPrizes();
  }, []);

  const handlePrizeFieldChange = (i: number, field: string, value: any) => {
    const updated = [...prizes];
    updated[i] = { ...updated[i], [field]: value };
    setPrizes(updated);
  };

  const addPrize = () => {
    setPrizes([
      ...prizes,
      {
        name: "",
        description: "",
        imageUrl: "",
        quantity: 1,
        probability: 1,
        active: true,
      },
    ]);
  };

  const handleSaveConfig = async () => {
    for (const prize of prizes) {
      const { id, createdAt, updatedAt, ...rest } = prize as any;
      const data = {
        ...rest,
        probability: Number(rest.probability),
      };
      await PrizesService.create(data);
    }
    // Optional: user feedback
    // alert('Prizes saved!');
  };

  const removePrize = (i: number) => {
    setPrizes(prizes.filter((_, idx) => idx !== i));
  };



  return (
    <div
      style={{
        padding: 30,
        fontFamily: "Inter, sans-serif",
        background: "#F5F6F7",
        minHeight: "100vh",
        width: "100%",
      }}
    >


      {/* SEÇÃO: PRÉ-VISUALIZAÇÃO DA ROLETA */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          marginBottom: 32,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          textAlign: "center",
        }}
      >
        <button
          style={{
            width: 200,
            height: 40,
            background: "#FFD54F",
            color: "#222",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 10,
            boxShadow: "0 2px 8px #FFD54F44",
            cursor: "pointer",
          }}
        >
          <a
            href="https://giuseppe-vidal-roleta-16hm.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#222", textDecoration: "none" }}
          >
            Acessar Roleta
          </a>
        </button>
        <h4 style={{ margin: 0 }}>Pré-visualização da Roleta</h4>
        {prizesBack.length > 0 ? (
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            style={{
              marginTop: 10,
            }}
          />
        ) : (
          <div style={{ marginTop: 20, color: '#bbb', fontSize: 15 }}>
            Register at least one prize to preview the roulette.
          </div>
        )}
        <p
          style={{
            fontSize: 12,
            color: "#999",
            marginTop: 10,
          }}
        >
          A roleta acima mostra exatamente como ficará para o cliente.
        </p>
      </div>
      {/* SELETOR DE PRODUTO/PRODUTOS */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          background: '#fff',
          borderRadius: 32,
          border: '2px solid #E0E0E0',
          width: 380,
          height: 40,
          alignItems: 'center',
          position: 'relative',
          boxShadow: '0 1px 4px #0001',
        }}>
          <button
            onClick={() => setProductTab('create')}
            style={{
              flex: 1,
              height: 35,
              border: 'none',
              background: productTab === 'create' ? '#FFD54F' : 'transparent',
              color: productTab === 'create' ? '#fff' : '#B0B0B0',
              fontWeight: 500,
              fontSize: 16,
              borderRadius: 32,
              cursor: 'pointer',
              zIndex: 2,
              transition: 'background 0.2s',
            }}
          >
            Add product
          </button>
          <button
            onClick={() => setProductTab('products')}
            style={{
              flex: 1,
              height: 35,
              border: 'none',
              background: productTab === 'products' ? '#FFD54F' : 'transparent',
              color: productTab === 'products' ? '#fff' : '#B0B0B0',
              fontWeight: 500,
              fontSize: 16,
              borderRadius: 32,
              cursor: 'pointer',
              marginLeft: -32,
              zIndex: 2,
              transition: 'background 0.2s',
            }}
          >
            Products
          </button>
        </div>
      </div>
      {productTab === 'products' && (
        <div style={{ marginBottom: 32 }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            padding: 0,
            overflow: 'hidden',
          }}>
            <div style={{
              fontWeight: 700,
              fontSize: 22,
              color: '#222',
              padding: '24px 24px 10px 24px',
            }}>
              Registered Products
            </div>
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: '#F5F6F7', color: '#888', fontWeight: 600, fontSize: 15 }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Image</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Quantity</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Probability</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {prizesBack.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ color: '#888', textAlign: 'center', padding: 24 }}>
                        No products registered.
                      </td>
                    </tr>
                  )}
                  {prizesBack.map((p, i) => (
                    editingIndex === i ? (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 600 }}>
                          <input
                            value={editValues.name || ''}
                            onChange={e => handleEditChange('name', e.target.value)}
                            style={{ padding: 6, borderRadius: 4, border: '1px solid #ddd', width: 100 }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <input
                            value={editValues.description || ''}
                            onChange={e => handleEditChange('description', e.target.value)}
                            style={{ padding: 6, borderRadius: 4, border: '1px solid #ddd', width: 100 }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <input
                            value={editValues.imageUrl || ''}
                            onChange={e => handleEditChange('imageUrl', e.target.value)}
                            style={{ padding: 6, borderRadius: 4, border: '1px solid #ddd', width: 120 }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <input
                            type="number"
                            value={editValues.quantity ?? 1}
                            min={1}
                            onChange={e => handleEditChange('quantity', Number(e.target.value))}
                            style={{ padding: 6, borderRadius: 4, border: '1px solid #ddd', width: 60 }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <input
                            type="number"
                            value={editValues.probability ?? 1}
                            min={1}
                            onChange={e => handleEditChange('probability', Number(e.target.value))}
                            style={{ padding: 6, borderRadius: 4, border: '1px solid #ddd', width: 60 }}
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <select
                            value={editValues.active ? 'active' : 'inactive'}
                            onChange={e => handleEditChange('active', e.target.value === 'active')}
                            style={{ padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 4px', minWidth: 120 }}>
                          <button
                            onClick={handleEditSave}
                            style={{
                              background: '#388e3c',
                              border: 'none',
                              color: '#fff',
                              borderRadius: 6,
                              padding: '4px 12px',
                              fontWeight: 600,
                              marginRight: 8,
                              cursor: 'pointer',
                              fontSize: 14,
                              transition: 'background 0.2s',
                            }}
                          >Save</button>
                          <button
                            onClick={handleEditCancel}
                            style={{
                              background: '#fff',
                              border: '1px solid #b71c1c',
                              color: '#b71c1c',
                              borderRadius: 6,
                              padding: '4px 12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontSize: 14,
                              transition: 'background 0.2s',
                            }}
                          >Cancel</button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 600 }}>{p.name}</td>
                        <td style={{ padding: '12px 8px' }}>{p.description}</td>
                        <td style={{ padding: '12px 8px' }}>
                          {p.imageUrl && (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
                            />
                          )}
                        </td>
                        <td style={{ padding: '12px 8px' }}>{p.quantity}</td>
                        <td style={{ padding: '12px 8px' }}>{p.probability}</td>
                        <td style={{ padding: '12px 8px', color: p.active ? '#388e3c' : '#b71c1c', fontWeight: 600 }}>
                          {p.active ? 'Active' : 'Inactive'}
                        </td>
                        <td style={{ padding: '12px 4px', minWidth: 90 }}>
                          <button
                            onClick={() => handleEditClick(i)}
                            style={{
                              background: '#fff',
                              border: '1px solid #FFD54F',
                              color: '#FFD54F',
                              borderRadius: 6,
                              padding: '4px 12px',
                              fontWeight: 600,
                              marginRight: 8,
                              cursor: 'pointer',
                              fontSize: 14,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              transition: 'background 0.2s, color 0.2s',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = '#FFD54F';
                              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                              (e.currentTarget as HTMLButtonElement).style.color = '#FFD54F';
                            }}
                          >
                            <svg width="16" height="16" fill="currentColor" style={{marginRight: 2}} viewBox="0 0 20 20"><path d="M15.41 2.59a2 2 0 0 0-2.83 0l-8.09 8.09a2 2 0 0 0-.58 1.41V16a2 2 0 0 0 2 2h3.91a2 2 0 0 0 1.41-.59l8.09-8.09a2 2 0 0 0 0-2.83l-4.91-4.91zm-2.12 1.41 4.91 4.91-8.09 8.09H4V12.8l8.09-8.09z"></path></svg>
                          </button>
                          <button
                            style={{
                              background: '#fff',
                              border: '1px solid #b71c1c',
                              color: '#b71c1c',
                              borderRadius: 6,
                              padding: '5px 5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontSize: 14,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              transition: 'background 0.2s, color 0.2s',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = '#b71c1c';
                              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                              (e.currentTarget as HTMLButtonElement).style.color = '#b71c1c';
                            }}
                          >
                            <svg width="16" height="16" fill="currentColor" style={{marginRight: 2}} viewBox="0 0 20 20"><path d="M6 7V6a4 4 0 1 1 8 0v1h5v2h-1v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9H1V7h5zm2-1a2 2 0 1 1 4 0v1H8V6zm-4 3v9h12V9H4z"></path></svg>
                          </button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {productTab === 'create' && (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <h2 style={{ margin: 0, color: "#222" }}>Edit Prizes</h2>
            <button
              onClick={addPrize}
              style={{
                background: "linear-gradient(90deg,#FFD54F,#FFB300)",
                border: "none",
                padding: "10px 22px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                color: "#222",
                boxShadow: "0 2px 8px #FFD54F44",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              + Adicionar Prêmio
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
            {prizes.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 18,
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 14,
                  background: "#fafafa",
                  position: "relative",
                  minWidth: 260,
                  boxShadow: "0 1px 4px #FFD54F22",
                }}
              >
                <button
                  onClick={() => removePrize(i)}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  ✕
                </button>

                <input
                  placeholder="Prize Name"
                  value={p.name}
                  onChange={(e) =>
                    handlePrizeFieldChange(i, "name", e.target.value)
                  }
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
                <input
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) =>
                    handlePrizeFieldChange(i, "description", e.target.value)
                  }
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
                <input
                  placeholder="Image URL"
                  value={p.imageUrl}
                  onChange={(e) =>
                    handlePrizeFieldChange(i, "imageUrl", e.target.value)
                  }
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={p.quantity}
                    min={1}
                    onChange={(e) =>
                      handlePrizeFieldChange(
                        i,
                        "quantity",
                        Number(e.target.value),
                      )
                    }
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      width: 120,
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Probability"
                    value={p.probability}
                    min={1}
                    onChange={(e) =>
                      handlePrizeFieldChange(
                        i,
                        "probability",
                        Number(e.target.value),
                      )
                    }
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      width: 120,
                    }}
                  />
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={p.active}
                      onChange={(e) =>
                        handlePrizeFieldChange(i, "active", e.target.checked)
                      }
                    />{" "}
                    Active
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button
              onClick={handleSaveConfig}
              style={{
                background: "#222",
                color: "#fff",
                border: "none",
                padding: "12px 28px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px #2222",
              }}
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* SEÇÃO: PRODUTOS EM DESTAQUE */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Produtos em Destaque</h3>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <input
            placeholder="ID do Produto"
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
          <input
            placeholder="Buscar Rápido"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
          <button
            onClick={() => setProducts([
              ...products,
              { name: "", description: "", price: "", image: "", tag: "" },
            ])}
            style={{
              background: "#FFC107",
              border: "none",
              padding: "10px 16px",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Add Product
          </button>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {products.map((p, i) => (
            <div
              key={i}
              style={{
                width: 180,
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 10,
                position: "relative",
              }}
            >
              <button
                style={{
                  position: "absolute",
                  right: 6,
                  top: 6,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
              <img
                src={p.image}
                style={{
                  width: "100%",
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  margin: "10px 0 4px",
                }}
              >
                {p.name}
              </p>
              <span style={{ fontSize: 12, color: "#777" }}>{p.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
}
