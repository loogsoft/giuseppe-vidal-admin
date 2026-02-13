import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import styles from "./Dashboard.module.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { FiCalendar, FiEye } from "react-icons/fi";
import Colors from "../../themes/Colors";

type MetricCard = {
  label: string;
  value: string;
  badge: string;
  icon: "money" | "orders" | "ticket" | "top";
  sub?: string;
  badgeTone?: "success" | "neutral";
};

type RecentSale = {
  id: string;
  date: string;
  time: string;
  client: { initials: string };
  clientName: string;
  products: string;
  total: string;
  status: "CONCLUIDO" | "CANCELADO";
};

type Period = "day" | "week" | "month";

type ChartPoint = {
  name: string;
  value: number;
};

type PeriodData = {
  metrics: MetricCard[];
  chart: ChartPoint[];
  recent: RecentSale[];
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string;
};

const DASHBOARD_MOCK: Record<Period, PeriodData> = {
  day: {
    metrics: [
      {
        label: "VENDAS TOTAIS",
        value: "128",
        badge: "+3.1%",
        icon: "orders",
        badgeTone: "success",
      },
      {
        label: "FATURAMENTO BRUTO",
        value: "R$ 6.420",
        badge: "+1.4%",
        icon: "money",
        badgeTone: "success",
      },
    ],
    chart: [
      { name: "08h", value: 12 },
      { name: "10h", value: 18 },
      { name: "12h", value: 32 },
      { name: "14h", value: 26 },
      { name: "16h", value: 22 },
      { name: "18h", value: 41 },
      { name: "20h", value: 33 },
    ],
    recent: [
      {
        id: "#99102",
        date: "09 Fev",
        time: "19:42",
        client: { initials: "RM" },
        clientName: "Ricardo Mendes",
        products: "1x Camisa Polo, 1x Cinto Couro",
        total: "R$ 54,90",
        status: "CONCLUIDO",
      },
      {
        id: "#99101",
        date: "09 Fev",
        time: "19:30",
        client: { initials: "AS" },
        clientName: "Amanda Silva",
        products: "2x Camiseta Basica, 1x Calca Jeans",
        total: "R$ 82,00",
        status: "CONCLUIDO",
      },
      {
        id: "#99098",
        date: "09 Fev",
        time: "19:25",
        client: { initials: "JO" },
        clientName: "João Oliveira",
        products: "1x Jaqueta Corta Vento, 1x Mochila",
        total: "R$ 42,50",
        status: "CANCELADO",
      },
      {
        id: "#99094",
        date: "09 Fev",
        time: "19:10",
        client: { initials: "CP" },
        clientName: "Carla P.",
        products: "3x Camiseta Infantil",
        total: "R$ 115,00",
        status: "CONCLUIDO",
      },
    ],
  },
  week: {
    metrics: [
      {
        label: "VENDAS TOTAIS",
        value: "4,289",
        badge: "+12.5%",
        icon: "orders",
        badgeTone: "success",
      },
      {
        label: "FATURAMENTO BRUTO",
        value: "R$ 158.240",
        badge: "+8.2%",
        icon: "money",
        badgeTone: "success",
      },
   
    ],
    chart: [
      { name: "SEG", value: 48 },
      { name: "TER", value: 64 },
      { name: "QUA", value: 58 },
      { name: "QUI", value: 92 },
      { name: "SEX", value: 24 },
      { name: "SAB", value: 96 },
      { name: "DOM", value: 86 },
    ],
    recent: [
      {
        id: "#88421",
        date: "12 Out",
        time: "19:42",
        client: { initials: "RM" },
        clientName: "Ricardo Mendes",
        products: "1x Camisa Polo, 1x Cinto Couro",
        total: "R$ 54,90",
        status: "CONCLUIDO",
      },
      {
        id: "#88428",
        date: "12 Out",
        time: "19:30",
        client: { initials: "AS" },
        clientName: "Amanda Silva",
        products: "2x Camiseta Basica, 1x Calca Jeans",
        total: "R$ 82,00",
        status: "CONCLUIDO",
      },
      {
        id: "#88419",
        date: "12 Out",
        time: "19:25",
        client: { initials: "JO" },
        clientName: "Joao Oliveira",
        products: "1x Jaqueta Corta Vento, 1x Mochila",
        total: "R$ 42,50",
        status: "CANCELADO",
      },
      {
        id: "#88418",
        date: "12 Out",
        time: "19:10",
        client: { initials: "CP" },
        clientName: "Carla P.",
        products: "3x Camiseta Infantil",
        total: "R$ 115,00",
        status: "CONCLUIDO",
      },
    ],
  },
  month: {
    metrics: [
      {
        label: "VENDAS TOTAIS",
        value: "18,902",
        badge: "+6.8%",
        icon: "orders",
        badgeTone: "success",
      },
      {
        label: "FATURAMENTO BRUTO",
        value: "R$ 612.980",
        badge: "+4.1%",
        icon: "money",
        badgeTone: "success",
      },
    ],
    chart: [
      { name: "SEM 1", value: 210 },
      { name: "SEM 2", value: 248 },
      { name: "SEM 3", value: 226 },
      { name: "SEM 4", value: 268 },
    ],
    recent: [
      {
        id: "#87021",
        date: "02 Fev",
        time: "12:16",
        client: { initials: "FP" },
        clientName: "Felipe Pereira",
        products: "2x Moletom, 1x Bone",
        total: "R$ 96,40",
        status: "CONCLUIDO",
      },
      {
        id: "#87013",
        date: "01 Fev",
        time: "18:03",
        client: { initials: "LL" },
        clientName: "Larissa Lima",
        products: "1x Vestido Midi, 1x Bolsa",
        total: "R$ 84,90",
        status: "CONCLUIDO",
      },
      {
        id: "#86988",
        date: "29 Jan",
        time: "20:10",
        client: { initials: "CB" },
        clientName: "Carlos Braga",
        products: "2x Camisa Social",
        total: "R$ 74,00",
        status: "CANCELADO",
      },
      {
        id: "#86975",
        date: "28 Jan",
        time: "19:22",
        client: { initials: "DM" },
        clientName: "Diana M.",
        products: "1x Jaqueta Jeans, 1x Shorts",
        total: "R$ 68,00",
        status: "CONCLUIDO",
      },
    ],
  },
};

function MetricIcon({ kind }: { kind: MetricCard["icon"] }) {
  if (kind === "money") return <span className={styles.metricIcon}>💰</span>;
  if (kind === "orders") return <span className={styles.metricIcon}>🛒</span>;
  if (kind === "ticket") return <span className={styles.metricIcon}>🎟️</span>;
  return <span className={styles.metricIcon}>🏆</span>;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value ?? 0);
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{label}</div>
      <div className={styles.tooltipValue}>R$ {(value * 13).toFixed(2)}</div>
    </div>
  );
}

export function Dashboard() {
  const [period, setPeriod] = useState<Period>("week");

  const periodData = useMemo(() => DASHBOARD_MOCK[period], [period]);
  const colorVars = {
    "--bg-primary": Colors.Background.primary,
    "--surface": Colors.Background.surface,
    "--surface-muted": Colors.Background.surfaceMuted,
    "--text-primary": Colors.Texts.primary,
    "--text-secondary": Colors.Texts.secondary,
    "--text-muted": Colors.Texts.muted,
    "--border-default": Colors.Border.default,
    "--highlight-primary": Colors.Highlight.primary,
    "--highlight-secondary": Colors.Highlight.secondary,
    "--status-success": Colors.Status.success,
    "--status-success-bg": Colors.Status.successBg,
    "--status-warning": Colors.Status.warning,
    "--status-warning-bg": Colors.Status.warningBg,
  } as CSSProperties;

  return (
    <div className={styles.page} style={colorVars}>
      <div className={styles.top}>
        <div>
          <h1 className={styles.title}>Dashboard Executivo</h1>
          <p className={styles.subtitle}>
            Bem-vindo de volta. Veja o desempenho do periodo selecionado.
          </p>
        </div>

        <div className={styles.actions}>
          <div className={styles.periodTabs}>
            <button
              className={`${styles.periodTab} ${
                period === "day" ? styles.periodTabActive : ""
              }`}
              type="button"
              onClick={() => setPeriod("day")}
            >
              Dia
            </button>
            <button
              className={`${styles.periodTab} ${
                period === "week" ? styles.periodTabActive : ""
              }`}
              type="button"
              onClick={() => setPeriod("week")}
            >
              Semana
            </button>
            <button
              className={`${styles.periodTab} ${
                period === "month" ? styles.periodTabActive : ""
              }`}
              type="button"
              onClick={() => setPeriod("month")}
            >
              Mês
            </button>
          </div>
        </div>
      </div>

      <div className={styles.metrics}>
        {periodData.metrics.map((m) => (
          <div key={m.label} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <MetricIcon kind={m.icon} />
              <span
                className={`${styles.metricBadge} ${
                  m.badgeTone === "neutral" ? styles.metricBadgeNeutral : ""
                }`}
              >
                {m.badge}
              </span>
            </div>

            <div className={styles.metricLabel}>{m.label}</div>

            {m.sub ? (
              <>
                <div className={styles.metricValueSmall}>{m.value}</div>
                <div className={styles.metricSub}>{m.sub}</div>
              </>
            ) : (
              <div className={styles.metricValue}>{m.value}</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <div className={styles.panelTitle}>Performance de Vendas</div>
            <div className={styles.panelSub}>Análise comparativa semanal</div>
          </div>

          <div className={styles.legend}>
            <span className={styles.legendItem}>Esta semana</span>
            <span className={`${styles.legendItem} ${styles.legendMuted}`}>
              Semana passada
            </span>
          </div>
        </div>

        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={periodData.chart} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={Colors.Highlight.primary} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={Colors.Highlight.secondary} stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: Colors.Texts.muted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="url(#barFill)"
                radius={[10, 10, 10, 10]}
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.tablePanel}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Vendas Recentes</div>

          <div className={styles.tableActions}>
            <button className={styles.filterBtn} type="button">
              <FiCalendar />
              01Out - 31Out
            </button>
            <button className={styles.filterBtn} type="button">
              Todos os Status
            </button>
          </div>
        </div>

        <div className={styles.table}>
          <div className={`${styles.row} ${styles.thead}`}>
            <div>ID PEDIDO</div>
            <div>DATA/HORA</div>
            <div>CLIENTE</div>
            <div>PRODUTOS</div>
            <div>VALOR TOTAL</div>
            <div>STATUS</div>
            <div>AÇÕES</div>
          </div>

          {periodData.recent.map((r) => (
            <div key={r.id} className={styles.row}>
              <div className={styles.idCell}>{r.id}</div>

              <div className={styles.dateCell}>
                <div>{r.date}</div>
                <div className={styles.muted}>{r.time}</div>
              </div>

              <div className={styles.clientCell}>
                <div className={styles.avatar}>{r.client.initials}</div>
                <div className={styles.clientName}>{r.clientName}</div>
              </div>

              <div className={styles.productsCell}>{r.products}</div>

              <div className={styles.totalCell}>{r.total}</div>

              <div>
                <span
                  className={
                    r.status === "CONCLUIDO" ? styles.statusOk : styles.statusBad
                  }
                >
                  {r.status}
                </span>
              </div>

              <div className={styles.actionsCell}>
                <button className={styles.eyeBtn} type="button" aria-label="Ver">
                  <FiEye />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tableFooter}>
          <div className={styles.muted}>Mostrando 4 de 432 pedidos</div>

          <div className={styles.pagination}>
            <button className={`${styles.pageBtn} ${styles.pageBtnActive}`} type="button">
              1
            </button>
            <button className={styles.pageBtn} type="button">
              2
            </button>
            <button className={styles.pageBtn} type="button">
              3
            </button>
            <button className={styles.pageBtn} type="button">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
