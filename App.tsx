
import React, { useState } from 'react';
import { 
  Plus, Trash2, FileDown, ScanBarcode, Settings, 
  ShoppingCart, Layout, Layers, Type, MoveVertical, Info, Maximize2, Move
} from 'lucide-react';
import { Product, LabelLayoutConfig } from './types';
import Label from './components/Label';
import { generatePDF } from './services/pdfService';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({ name: '', price: '', barcode: '', quantity: 1 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const [config, setConfig] = useState<LabelLayoutConfig>({
    nameFontSize: 6.5,
    nameHeight: 5.5,
    barcodeHeight: 20,
    barcodeWidth: 0.8,
    barcodeFontSize: 7,
    barcodeYOffset: 2,
    priceFontSize: 7,
    priceHeight: 5,
    priceYOffset: -0.5,
    paddingTop: 1.2,
    paddingBottom: 1.5,
    gap: 2 
  });

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.barcode || !formData.price) return;
    setProducts([{ id: crypto.randomUUID(), ...formData }, ...products]);
    setFormData({ name: '', price: '', barcode: '', quantity: 1 });
  };

  const handleExport = async () => {
    if (products.length === 0) return;
    setIsGenerating(true);
    try {
      await generatePDF(products, config, setProgress);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Có lỗi xảy ra khi xuất PDF.");
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const PREVIEW_SCALE = 2; // Giảm từ 3 xuống 2 để khu xem trước nhỏ hơn

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* SIDEBAR */}
      <aside className="w-85 bg-white border-r flex flex-col shadow-2xl z-20 overflow-y-auto">
        <div className="p-6 border-b flex items-center space-x-3 bg-indigo-600 text-white sticky top-0 z-30">
          <ScanBarcode size={26} strokeWidth={2.5} />
          <div>
            <h1 className="font-bold text-lg leading-tight uppercase tracking-tight">Gmart Label Printer</h1>
            <p className="text-[10px] opacity-80 font-medium">Credit: @phmvu03</p>
          </div>
        </div>

        <div className="p-6 space-y-10">
          <section>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <Plus size={14} className="mr-2" /> Thêm sản phẩm
            </h2>
            <form onSubmit={addProduct} className="space-y-3">
              <input 
                placeholder="Tên sản phẩm..." 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  placeholder="Giá bán" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
                <input 
                  type="number"
                  placeholder="Số tem" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                />
              </div>
              <input 
                placeholder="Mã vạch..." 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.barcode}
                onChange={e => setFormData({...formData, barcode: e.target.value})}
              />
              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase active:scale-95 transition-all">
                Thêm vào danh sách
              </button>
            </form>
          </section>

          <section className="space-y-6 pb-10">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <Settings size={14} className="mr-2" /> Điều chỉnh Layout (mm)
            </h2>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-5">
              {/* Tên */}
              <div className="space-y-4">
                <ConfigSlider label="Tên - Cỡ chữ" icon={<Type size={12}/>} value={config.nameFontSize} min={4} max={12} onChange={v => setConfig({...config, nameFontSize: v})} />
                <ConfigSlider label="Tên - Độ cao" icon={<MoveVertical size={12}/>} value={config.nameHeight} min={2} max={12} onChange={v => setConfig({...config, nameHeight: v})} />
              </div>
              
              <div className="h-px bg-slate-200" />
              
              {/* Barcode */}
              <div className="space-y-4">
                <ConfigSlider label="Mã - Chiều cao" icon={<Maximize2 size={12}/>} value={config.barcodeHeight} min={5} max={25} onChange={v => setConfig({...config, barcodeHeight: v})} />
                <ConfigSlider label="Mã - Vị trí dọc" icon={<Move size={12}/>} value={config.barcodeYOffset} min={-10} max={15} step={0.5} onChange={v => setConfig({...config, barcodeYOffset: v})} />
                <ConfigSlider label="Mã - Độ rộng vạch" icon={<Layers size={12}/>} value={config.barcodeWidth} min={0.3} max={3.5} step={0.1} onChange={v => setConfig({...config, barcodeWidth: v})} />
              </div>
              
              <div className="h-px bg-slate-200" />
              
              {/* Giá */}
              <div className="space-y-4">
                <ConfigSlider label="Giá - Cỡ chữ" icon={<Type size={12}/>} value={config.priceFontSize} min={4} max={22} onChange={v => setConfig({...config, priceFontSize: v})} />
                <ConfigSlider label="Giá - Độ cao" icon={<MoveVertical size={12}/>} value={config.priceHeight} min={2} max={10} onChange={v => setConfig({...config, priceHeight: v})} />
                <ConfigSlider label="Giá - Vị trí dọc" icon={<Move size={12}/>} value={config.priceYOffset} min={-10} max={10} step={0.5} onChange={v => setConfig({...config, priceYOffset: v})} />
              </div>
            </div>
          </section>
        </div>
      </aside>

      {/* WORKSPACE */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center space-x-2 text-slate-400 font-bold text-xs uppercase">
            <Layout size={18} className="text-indigo-600" />
            <span>Workspace</span>
          </div>
          <button 
            onClick={handleExport}
            disabled={products.length === 0 || isGenerating}
            className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-full font-bold text-sm transition-all"
          >
            <FileDown size={18} />
            <span>{isGenerating ? `Đang xuất ${progress}%` : 'Tải File PDF'}</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto flex flex-col items-center p-6 lg:p-12">
          <div className="relative mb-8 group">
            <div className="absolute -inset-10 bg-indigo-500/5 rounded-full blur-3xl opacity-50"></div>
            <div className="relative bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-3 py-1.5 border-b flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Xem trước (72mm x 22mm)</span>
                <Info size={10} className="text-slate-300" />
              </div>
              <div className="p-6 flex items-center justify-center bg-slate-50/30">
                <div 
                  className="flex bg-white shadow-inner" 
                  style={{ width: `${72 * PREVIEW_SCALE}mm`, height: `${22 * PREVIEW_SCALE}mm`, gap: `${config.gap * PREVIEW_SCALE}mm` }}
                >
                  <Label name={formData.name || "Sản phẩm mẫu ABC"} price={formData.price || "150000"} barcode={formData.barcode || "89312345678"} config={config} scale={PREVIEW_SCALE} showBorder />
                  <Label name={formData.name || "Sản phẩm mẫu ABC"} price={formData.price || "150000"} barcode={formData.barcode || "89312345678"} config={config} scale={PREVIEW_SCALE} showBorder />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-4xl bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-800 flex items-center text-sm">
                <ShoppingCart size={18} className="mr-2 text-indigo-500" />
                Hàng đợi in ({products.length})
              </h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-[250px] overflow-y-auto">
              {products.length === 0 ? (
                <div className="py-12 text-center text-slate-300 font-medium text-xs">Danh sách trống</div>
              ) : (
                products.map(p => (
                  <div key={p.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center font-bold text-indigo-600 text-[10px]">{p.quantity}</div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{p.name}</h4>
                        <p className="text-[10px] text-slate-500">{p.barcode} • {parseInt(p.price).toLocaleString()} VND</p>
                      </div>
                    </div>
                    <button onClick={() => setProducts(products.filter(i => i.id !== p.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ConfigSlider = ({ label, icon, value, min, max, step = 0.1, onChange }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
      <div className="flex items-center text-slate-500">{icon}<span className="ml-2">{label}</span></div>
      <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded">{value}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
  </div>
);

export default App;
