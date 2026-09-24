import { useMemo, useState } from 'react';
import { Package, Wallet, TrendingUp, Hourglass } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import AdminLayout from '../components/AdminLayout';
import { useProducts } from '../hooks/useCatalog';
import { revenueByPeriod, stockByCategory, type RevenuePeriod } from '../utils/stats';

const PERIODS: { key: RevenuePeriod; label: string }[] = [
  { key: 'semaine', label: 'Semaine' },
  { key: 'mois', label: 'Mois' },
  { key: 'annee', label: 'Année' },
];

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);

const DOUGHNUT_COLORS = ['#8B1E3F', '#D4AF37', '#1C1C1C', '#B8952E', '#5A5A5A', '#6E1732'];

export default function AdminDashboardPage() {
  const { products, loading } = useProducts();
  const [period, setPeriod] = useState<RevenuePeriod>('mois');

  const stats = useMemo(() => {
    const disponibles = products.filter((p) => p.statut === 'disponible');
    const vendus = products.filter((p) => p.statut === 'vendu');
    return {
      count: disponibles.length,
      valeurStock: disponibles.reduce((sum, p) => sum + p.prix, 0),
      revenu: vendus.reduce((sum, p) => sum + p.prix, 0),
      recents: products.filter((p) => (Date.now() - new Date(p.created_at).getTime()) / 86400000 <= 14).length,
    };
  }, [products]);

  const revenue = useMemo(() => revenueByPeriod(products, period), [products, period]);
  const stock = useMemo(() => stockByCategory(products), [products]);

  const lineData = {
    labels: revenue.map((r) => r.label),
    datasets: [{
      label: 'Revenu (FCFA)',
      data: revenue.map((r) => r.total),
      borderColor: '#8B1E3F',
      backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D } }) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
        g.addColorStop(0, 'rgba(139,30,63,0.25)');
        g.addColorStop(1, 'rgba(139,30,63,0)');
        return g;
      },
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#D4AF37',
      pointBorderColor: '#8B1E3F',
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2.5,
    }],
  };

  const doughnutData = {
    labels: stock.map((s) => s.label),
    datasets: [{
      data: stock.map((s) => s.count),
      backgroundColor: DOUGHNUT_COLORS,
      borderColor: '#FFF9F3',
      borderWidth: 3,
    }],
  };

  return (
    <AdminLayout>
      <div className="p-8 md:p-10 max-w-6xl">
        <h1 className="font-display text-3xl text-[#1C1C1C] mb-8">Vue d'ensemble</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={Package} label="Pagnes en stock" value={String(stats.count)} />
          <StatCard icon={Wallet} label="Valeur du stock" value={`${stats.valeurStock.toLocaleString()} F`} />
          <StatCard icon={TrendingUp} label="Revenu total" value={`${stats.revenu.toLocaleString()} F`} accent />
          <StatCard icon={Hourglass} label="Ajoutés (14 derniers jours)" value={String(stats.recents)} />
        </div>

        {loading ? (
          <p className="text-[#A89A8E]">Chargement…</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#8B1E3F]/10 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <p className="font-display text-lg text-[#1C1C1C] mb-1">Évolution des ventes</p>
                  <p className="text-[#5A5A5A] text-sm">Revenu par {period}</p>
                </div>
                <div className="flex gap-1 bg-[#F3E9DE] rounded-full p-1">
                  {PERIODS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPeriod(p.key)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors ${
                        period === p.key ? 'bg-[#8B1E3F] text-[#FFF9F3]' : 'text-[#5A5A5A] hover:text-[#8B1E3F]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64">
                <Line
                  data={lineData}
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${Number(c.raw).toLocaleString()} FCFA` } } },
                    scales: {
                      y: { beginAtZero: true, grid: { color: '#8B1E3F0D' }, ticks: { color: '#5A5A5A', font: { size: 11 } } },
                      x: { grid: { display: false }, ticks: { color: '#5A5A5A', font: { size: 11 } } },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#8B1E3F]/10 p-6">
              <p className="font-display text-lg text-[#1C1C1C] mb-1">Stock par catégorie</p>
              <p className="text-[#5A5A5A] text-sm mb-5">Pagnes disponibles</p>
              {stock.length === 0 ? (
                <p className="text-[#A89A8E] text-sm py-10 text-center">Aucun pagne en stock.</p>
              ) : (
                <div className="h-52 flex items-center justify-center">
                  <Doughnut
                    data={doughnutData}
                    options={{
                      responsive: true, maintainAspectRatio: false,
                      plugins: { legend: { position: 'bottom', labels: { color: '#5A5A5A', boxWidth: 10, padding: 12, font: { size: 11 } } } },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Package; label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-[#8B1E3F]/10 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${accent ? 'bg-[#D4AF37]/15' : 'bg-[#8B1E3F]/8'}`}>
        <Icon size={19} className={accent ? 'text-[#B8952E]' : 'text-[#8B1E3F]'} />
      </div>
      <div>
        <p className="font-display text-xl text-[#1C1C1C]">{value}</p>
        <p className="text-[#5A5A5A] text-xs">{label}</p>
      </div>
    </div>
  );
}
