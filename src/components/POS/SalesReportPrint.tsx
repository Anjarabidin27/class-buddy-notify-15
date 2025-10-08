import { Receipt } from '@/types/pos';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface SalesReportPrintProps {
  receipts: Receipt[];
  formatPrice: (price: number) => string;
  periodLabel: string;
  startDate: Date;
  endDate: Date;
  stats: {
    totalSales: number;
    totalProfit: number;
    totalDiscount: number;
    totalTransactions: number;
    totalItems: number;
  };
  storeName?: string;
  storeAddress?: string;
}

export const generateA4PrintContent = ({
  receipts,
  formatPrice,
  periodLabel,
  startDate,
  endDate,
  stats,
  storeName = 'Toko',
  storeAddress = ''
}: SalesReportPrintProps): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Laporan Penjualan - ${periodLabel}</title>
  <style>
    @page {
      size: A4;
      margin: 1.5cm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 10pt;
      line-height: 1.3;
      color: #000;
      background: white;
    }
    
    .container {
      width: 100%;
      max-width: 21cm;
      margin: 0 auto;
      padding: 0;
    }
    
    /* Header */
    .header {
      text-align: center;
      border-bottom: 3px solid #000;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    
    .header h1 {
      font-size: 20pt;
      font-weight: bold;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .header .store-info {
      font-size: 9pt;
      color: #333;
      margin-bottom: 2px;
    }
    
    .header .report-title {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 8px;
      margin-bottom: 3px;
    }
    
    .header .period {
      font-size: 9pt;
      color: #555;
    }
    
    /* Summary Box */
    .summary-box {
      background: #f8f9fa;
      border: 2px solid #dee2e6;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .summary-title {
      font-size: 12pt;
      font-weight: bold;
      margin-bottom: 12px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: white;
      border-radius: 4px;
      border: 1px solid #dee2e6;
    }
    
    .summary-label {
      font-weight: 600;
      color: #495057;
    }
    
    .summary-value {
      font-weight: bold;
      color: #000;
    }
    
    .summary-highlight {
      grid-column: 1 / -1;
      background: #d4edda;
      border-color: #c3e6cb;
    }
    
    .summary-highlight .summary-value {
      color: #155724;
      font-size: 13pt;
    }
    
    /* Table */
    .transactions-section {
      margin-top: 20px;
    }
    
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 2px solid #000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      font-size: 9pt;
    }
    
    thead {
      background: #343a40;
      color: white;
    }
    
    th {
      padding: 8px 6px;
      text-align: left;
      font-weight: bold;
      border: 1px solid #000;
    }
    
    tbody tr {
      border-bottom: 1px solid #dee2e6;
    }
    
    tbody tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    td {
      padding: 6px;
      border: 1px solid #dee2e6;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .item-details {
      font-size: 8pt;
      color: #666;
      padding-left: 12px;
      margin-top: 2px;
    }
    
    .discount-row {
      color: #dc3545;
      font-style: italic;
    }
    
    .total-row {
      font-weight: bold;
      background: #fff3cd !important;
    }
    
    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 2px solid #000;
      text-align: center;
      font-size: 8pt;
      color: #666;
    }
    
    .signature-section {
      display: flex;
      justify-content: space-around;
      margin-top: 40px;
      margin-bottom: 25px;
    }
    
    .signature-box {
      text-align: center;
      width: 180px;
    }
    
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 50px;
      padding-top: 5px;
    }
    
    /* Print specific */
    @media print {
      body {
        background: white;
      }
      
      .container {
        width: 100%;
        max-width: none;
      }
      
      .page-break {
        page-break-after: always;
      }
      
      /* Prevent breaking inside elements */
      .summary-box,
      .summary-item,
      tr {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${storeName}</h1>
      ${storeAddress ? `<div class="store-info">${storeAddress}</div>` : ''}
      <div class="report-title">Laporan Penjualan</div>
      <div class="period">${periodLabel}</div>
      <div class="period">${format(startDate, 'dd MMMM yyyy', { locale: id })} - ${format(endDate, 'dd MMMM yyyy', { locale: id })}</div>
    </div>
    
    <!-- Summary Box -->
    <div class="summary-box">
      <div class="summary-title">Ringkasan Penjualan</div>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="summary-label">Total Transaksi:</span>
          <span class="summary-value">${stats.totalTransactions}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Total Item Terjual:</span>
          <span class="summary-value">${stats.totalItems}</span>
        </div>
        ${stats.totalDiscount > 0 ? `
        <div class="summary-item">
          <span class="summary-label">Total Diskon:</span>
          <span class="summary-value">${formatPrice(stats.totalDiscount)}</span>
        </div>
        ` : ''}
        <div class="summary-item">
          <span class="summary-label">Total Penjualan:</span>
          <span class="summary-value">${formatPrice(stats.totalSales)}</span>
        </div>
        <div class="summary-item summary-highlight">
          <span class="summary-label">Total Keuntungan Bersih:</span>
          <span class="summary-value">${formatPrice(stats.totalProfit)}</span>
        </div>
      </div>
    </div>
    
    <!-- Transactions Table -->
    <div class="transactions-section">
      <div class="section-title">Detail Transaksi</div>
      <table>
        <thead>
          <tr>
            <th style="width: 5%;">No</th>
            <th style="width: 20%;">ID Transaksi</th>
            <th style="width: 15%;">Tanggal</th>
            <th style="width: 15%;">Jam</th>
            <th style="width: 30%;">Item</th>
            <th style="width: 15%;" class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${receipts.map((receipt, index) => `
            <tr>
              <td class="text-center">${index + 1}</td>
              <td>${receipt.id}</td>
              <td>${format(new Date(receipt.timestamp), 'dd MMM yyyy', { locale: id })}</td>
              <td>${format(new Date(receipt.timestamp), 'HH:mm', { locale: id })}</td>
              <td>
                ${receipt.items.map(item => `
                  <div class="item-details">
                    • ${item.product.name} x${item.quantity} @ ${formatPrice(item.finalPrice || item.product.sellPrice)} = ${formatPrice((item.finalPrice || item.product.sellPrice) * item.quantity)}
                  </div>
                `).join('')}
                ${receipt.discount > 0 ? `
                  <div class="item-details discount-row">
                    • Diskon: -${formatPrice(receipt.discount)}
                  </div>
                ` : ''}
              </td>
              <td class="text-right total-row">${formatPrice(receipt.total)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- Signature Section -->
    <div class="signature-section">
      <div class="signature-box">
        <div>Dibuat Oleh,</div>
        <div class="signature-line">Kasir</div>
      </div>
      <div class="signature-box">
        <div>Disetujui Oleh,</div>
        <div class="signature-line">Manajer/Pemilik</div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>Dicetak pada: ${format(new Date(), 'dd MMMM yyyy, HH:mm', { locale: id })} WIB</p>
      <p>Laporan ini dibuat secara otomatis oleh sistem kasir</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const printA4Report = (props: SalesReportPrintProps) => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(generateA4PrintContent(props));
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }
};
