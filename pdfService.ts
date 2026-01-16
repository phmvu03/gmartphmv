
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Product, LabelLayoutConfig } from '../types';

export const generatePDF = async (products: Product[], config: LabelLayoutConfig, onProgress: (p: number) => void) => {
  const allLabels = products.flatMap(p => Array(p.quantity).fill(p));
  const pairs: Product[][] = [];
  for (let i = 0; i < allLabels.length; i += 2) {
    pairs.push(allLabels.slice(i, i + 2));
  }

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [72, 22]
  });

  const JsBarcodeModule = await import('jsbarcode');
  const JsBarcode = JsBarcodeModule.default || JsBarcodeModule;

  for (let i = 0; i < pairs.length; i++) {
    onProgress(Math.round((i / pairs.length) * 100));
    const pair = pairs[i];
    
    const container = document.createElement('div');
    container.style.width = '72mm';
    container.style.height = '22mm';
    container.style.display = 'flex';
    container.style.gap = `${config.gap}mm`;
    container.style.backgroundColor = 'white';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    for (let j = 0; j < 2; j++) {
      const prod = pair[j];
      const label = document.createElement('div');
      label.style.width = '35mm';
      label.style.height = '22mm';
      label.style.display = 'flex';
      label.style.flexDirection = 'column';
      label.style.padding = `${config.paddingTop}mm 1mm ${config.paddingBottom}mm 1mm`;
      label.style.boxSizing = 'border-box';
      label.style.overflow = 'hidden';
      label.style.fontFamily = 'Arial, sans-serif';
      label.style.backgroundColor = 'white';
      label.style.position = 'relative';

      if (prod) {
        // Tên - Nâng zIndex lên 20
        const nBox = document.createElement('div');
        nBox.style.height = `${config.nameHeight}mm`;
        nBox.style.display = 'flex';
        nBox.style.alignItems = 'center';
        nBox.style.justifyContent = 'center';
        nBox.style.flexShrink = '0';
        nBox.style.zIndex = '20';
        nBox.style.position = 'relative';
        
        const nText = document.createElement('div');
        nText.innerText = prod.name;
        nText.style.fontSize = `${config.nameFontSize}pt`;
        nText.style.fontWeight = 'bold';
        nText.style.textAlign = 'center';
        nText.style.lineHeight = '1.1';
        nText.style.display = '-webkit-box';
        nText.style.webkitLineClamp = '2';
        nText.style.webkitBoxOrient = 'vertical';
        nText.style.overflow = 'visible'; // Chống cắt chữ
        nBox.appendChild(nText);

        // Barcode - zIndex 10
        const bBox = document.createElement('div');
        bBox.style.flex = '1';
        bBox.style.display = 'flex';
        bBox.style.alignItems = 'center';
        bBox.style.justifyContent = 'center';
        bBox.style.transform = `translateY(${config.barcodeYOffset}mm)`;
        bBox.style.zIndex = '10';
        bBox.style.position = 'relative';
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        bBox.appendChild(svg);

        // Giá - zIndex 5
        const pBox = document.createElement('div');
        pBox.style.height = `${config.priceHeight}mm`;
        pBox.style.display = 'flex';
        pBox.style.alignItems = 'center';
        pBox.style.justifyContent = 'center';
        pBox.style.flexShrink = '0';
        pBox.style.transform = `translateY(${config.priceYOffset}mm)`;
        pBox.style.zIndex = '5';
        pBox.style.position = 'relative';
        const pText = document.createElement('div');
        pText.innerText = `${parseInt(prod.price.toString().replace(/[^0-9]/g, '')).toLocaleString('vi-VN')} VND`;
        pText.style.fontSize = `${config.priceFontSize}pt`;
        pText.style.fontWeight = 'bold';
        pBox.appendChild(pText);

        label.appendChild(nBox);
        label.appendChild(bBox);
        label.appendChild(pBox);

        JsBarcode(svg, prod.barcode, {
          format: "CODE128",
          width: config.barcodeWidth,
          height: config.barcodeHeight,
          displayValue: true,
          fontSize: config.barcodeFontSize,
          textMargin: 1,
          margin: 0
        });
      }
      container.appendChild(label);
    }

    try {
      await new Promise(r => setTimeout(r, 200));
      const canvas = await html2canvas(container, { 
        scale: 4, 
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      if (i > 0) pdf.addPage([72, 22], 'landscape');
      pdf.addImage(imgData, 'JPEG', 0, 0, 72, 22);
    } catch (e) {
      console.error(e);
    } finally {
      document.body.removeChild(container);
    }
  }

  onProgress(100);
  pdf.save(`Tem_GMart_Pro_${Date.now()}.pdf`);
};
