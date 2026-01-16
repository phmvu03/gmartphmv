
import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { LabelLayoutConfig } from '../types';

interface LabelProps {
  name: string;
  price: string;
  barcode: string;
  config: LabelLayoutConfig;
  scale?: number;
  showBorder?: boolean;
}

const Label: React.FC<LabelProps> = ({ name, price, barcode, config, scale = 1, showBorder = false }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && barcode) {
      try {
        JsBarcode(barcodeRef.current, barcode, {
          format: "CODE128",
          width: config.barcodeWidth,
          height: config.barcodeHeight,
          displayValue: true,
          fontSize: config.barcodeFontSize,
          textMargin: 1,
          margin: 0,
          background: "transparent"
        });
      } catch (err) {
        console.error("Barcode Error:", err);
      }
    }
  }, [barcode, config]);

  const formattedPrice = (val: string) => {
    const num = parseInt(val.toString().replace(/[^0-9]/g, '')) || 0;
    return num.toLocaleString('vi-VN');
  };

  const containerStyle: React.CSSProperties = {
    width: `${35 * scale}mm`,
    height: `${22 * scale}mm`,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: `${config.paddingTop * scale}mm ${1 * scale}mm ${config.paddingBottom * scale}mm ${1 * scale}mm`,
    boxSizing: 'border-box',
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif',
    color: '#000',
    border: showBorder ? '1px dashed #cbd5e1' : 'none',
    position: 'relative'
  };

  return (
    <div style={containerStyle}>
      {/* 1. TÊN SẢN PHẨM - ĐƯA LÊN LỚP CAO NHẤT */}
      <div style={{ 
        height: `${config.nameHeight * scale}mm`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 20, // Đã nâng lên 20 để không bị barcode đè
        position: 'relative'
      }}>
        <div style={{ 
          fontSize: `${config.nameFontSize * scale}pt`, 
          fontWeight: 'bold', 
          textAlign: 'center',
          lineHeight: '1.1',
          width: '100%',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'visible' // Đổi thành visible để không bị cắt dấu phía trên
        }}>
          {name || "Sản phẩm mẫu"}
        </div>
      </div>

      {/* 2. MÃ VẠCH (VÙNG GIỮA) */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'visible',
        transform: `translateY(${config.barcodeYOffset * scale}mm)`,
        zIndex: 10
      }}>
        <svg ref={barcodeRef} style={{ maxWidth: '100%' }}></svg>
      </div>

      {/* 3. GIÁ TIỀN */}
      <div style={{ 
        height: `${config.priceHeight * scale}mm`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 5,
        transform: `translateY(${config.priceYOffset * scale}mm)`
      }}>
        <div style={{ 
          fontSize: `${config.priceFontSize * scale}pt`, 
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}>
          {price ? `${formattedPrice(price)} VND` : "0 VND"}
        </div>
      </div>
    </div>
  );
};

export default Label;
