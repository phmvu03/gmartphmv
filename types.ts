
export interface Product {
  id: string;
  name: string;
  price: string;
  barcode: string;
  quantity: number;
}

export interface LabelLayoutConfig {
  nameFontSize: number;
  nameHeight: number;
  barcodeHeight: number;
  barcodeWidth: number;
  barcodeFontSize: number;
  barcodeYOffset: number;
  priceFontSize: number;
  priceHeight: number;
  priceYOffset: number; // Thuộc tính mới
  paddingTop: number;
  paddingBottom: number;
  gap: number;
}
