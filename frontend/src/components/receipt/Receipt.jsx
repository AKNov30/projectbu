import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { print } from '../../assets';

const Receipt = ({ reservation }) => {
    const content = `
        <html>
            <head>
                <title>ใบเสร็จ</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .receipt { padding: 20px; }
                    h1 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <h1>ใบเสร็จรับเงิน</h1>
                    <p>ชื่อลูกค้า: ${reservation.firstname} ${reservation.lastname}</p>
                    <p>วันที่จอง: ${new Date(reservation.created_at).toLocaleDateString()}</p>
                    <p>วันที่ขาย: ${new Date(reservation.booking_date).toLocaleDateString()}</p>
                    <p>ชื่อรายการ: ${reservation.dogs_name}</p>
                    <p>รหัส: ${reservation.booking_id}</p>
                    <p>ราคา: ${formatPrice(reservation.price)}</p>
                    <p>รวมเป็น: ${formatPrice(reservation.price)}</p>
                </div>
            </body>
        </html>
    `;

    const printReceipt = () => {
        const receiptWindow = window.open('', '_blank');
        receiptWindow.document.write(content);
        receiptWindow.document.close();
        receiptWindow.print();
    };

    return (
        <div className="text-center" style={{ cursor: 'pointer' }} onClick={printReceipt}>
            <img src={print} style={{ width: '25px' }} alt="Print" />
        </div>
    );
};

export default Receipt;
