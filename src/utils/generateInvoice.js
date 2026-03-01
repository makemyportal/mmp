import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const numberToWords = (amount) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const numToWordsStr = (num) => {
        if ((num = num.toString()).length > 9) return 'overflow';
        const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return '';
        let str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
        return str.trim();
    };

    let rupees = Math.floor(amount);
    let paise = Math.round((amount - rupees) * 100);

    let result = "Rupees " + numToWordsStr(rupees);
    if (paise > 0) {
        result += " and Paise " + numToWordsStr(paise);
    }
    return result + " Only";
};

export const generateInvoice = (order, siteSettings) => {
    const doc = new jsPDF();

    const stringPrice = String(order.price || '0').replace(/[^0-9.]/g, '');
    const grossTotal = parseFloat(stringPrice) || 0;
    const basePrice = grossTotal / 1.18; // Using 18% GST (Standard for IT Services)
    const igst = grossTotal - basePrice; // Indian Inter-state tax calculation

    // Clean up file name to ensure the OS saves it exactly as .pdf
    const invoiceNum = `INV-${(order.id || "000000").substring(0, 6).toUpperCase()}`;
    // Strictly remove all spaces, punctuation, and special characters from the name
    const cleanCustomerName = String(order.customerName || order.userEmail || "Customer").split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const filename = `${invoiceNum}_${cleanCustomerName}.pdf`;

    // Global Font Settings
    doc.setFont("helvetica");

    // HEADER: TAX INVOICE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("TAX INVOICE", 105, 20, { align: "center" });

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(14, 25, 196, 25); // Top Header Line

    // Top Section - 2 Columns: Seller & Buyer Details
    // SELLER
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Billed By (Supplier):", 16, 32);

    doc.setFontSize(11);
    doc.text(siteSettings?.businessName || "MakeMyPortal.com", 16, 38);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    // Process multiline address nicely, or default
    const addressLines = doc.splitTextToSize(siteSettings?.address || "New Delhi, India\nState Code: 07", 80);
    doc.text(addressLines, 16, 43);

    let sellerY = 43 + (addressLines.length * 4);
    doc.text(`Phone: ${siteSettings?.phone || "Update phone in settings"}`, 16, sellerY + 2);
    doc.text(`Email: ${siteSettings?.contactEmail || "hello@makemyportal.com"}`, 16, sellerY + 7);

    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN/UIN: ${siteSettings?.gstin || "07AABCU9603R1ZX"}`, 16, sellerY + 14);

    // DIVIDER VERTICAL
    doc.line(105, 25, 105, 80); // Vertical Middle Line

    // BUYER
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Billed To (Recipient):", 108, 32);

    doc.setFontSize(11);
    doc.text((order.customerName || order.userEmail?.split('@')[0] || "Customer").toUpperCase(), 108, 38);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Email: ${order.userEmail || "N/A"}`, 108, 43);

    let buyerY = 48;
    if (order.phone) { doc.text(`Phone: ${order.phone}`, 108, buyerY); buyerY += 5; }
    if (order.company) { doc.text(`Company: ${order.company}`, 108, buyerY); buyerY += 5; }
    if (order.address) {
        const buyerAddr = doc.splitTextToSize(`Address: ${order.address}`, 85);
        doc.text(buyerAddr, 108, buyerY);
        buyerY += (buyerAddr.length * 5);
    }

    doc.setFont("helvetica", "bold");
    doc.text(`Place of Supply: ${order.state || "Inter-State"}`, 108, 77);

    doc.line(14, 80, 196, 80); // Bottom section line

    // INVOICE META
    const paymentDateStr = order.updatedAt?.toDate ? order.updatedAt.toDate().toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`Invoice No: ${invoiceNum}`, 16, 86);
    doc.text(`Invoice Date: ${paymentDateStr}`, 108, 86);
    doc.line(14, 90, 196, 90);

    // SERVICES TABLE
    const tableCols = ["S.No.", "Service Description", "SAC Code", "Qty", "Rate (Rs)", "Taxable Value (Rs)"];
    const tableBody = [
        [
            "1",
            order.serviceName || "Digital & IT Services",
            "998314",
            "1",
            basePrice.toFixed(2),
            basePrice.toFixed(2)
        ]
    ];

    autoTable(doc, {
        startY: 94,
        head: [tableCols],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineWidth: 0.1, lineColor: 0 },
        bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.1, lineColor: 0 },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            1: { cellWidth: 65 },
            2: { halign: 'center', cellWidth: 25 },
            3: { halign: 'center', cellWidth: 15 },
            4: { halign: 'right' },
            5: { halign: 'right' }
        },
        styles: { font: "helvetica", cellPadding: 4, fontSize: 9 }
    });

    let finalY = doc.lastAutoTable.finalY;

    // TAX AND MULTI-ROW TOTALS TABLE
    const taxTableCols = [
        [{ content: 'Total Taxable Value', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } }, { content: basePrice.toFixed(2), styles: { halign: 'right', fontStyle: 'bold' } }],
        [{ content: 'IGST @ 18%', colSpan: 5, styles: { halign: 'right' } }, { content: igst.toFixed(2), styles: { halign: 'right' } }],
        [{ content: 'Invoice Total (Amount in Rs.)', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 240, 240] } }, { content: grossTotal.toFixed(2), styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 240, 240] } }]
    ];

    autoTable(doc, {
        startY: finalY,
        body: taxTableCols,
        theme: 'grid',
        styles: { font: "helvetica", cellPadding: 4, fontSize: 9, lineWidth: 0.1, lineColor: 0 },
    });

    finalY = doc.lastAutoTable.finalY + 10;

    // AMOUNT IN WORDS
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Amount in Words:", 16, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(numberToWords(grossTotal), 16, finalY + 6);

    // BANK DETAILS
    doc.setFont("helvetica", "bold");
    doc.text("Bank Details:", 16, finalY + 18);
    doc.setFont("helvetica", "normal");
    doc.text("Bank Name: HDFC Bank (Test Branch)", 16, finalY + 23);
    doc.text("A/C No: XXXXXXXXXX0000", 16, finalY + 28);
    doc.text("IFSC Code: HDFC0000001", 16, finalY + 33);

    // SIGNATURE & PAYMENT STATUS
    doc.setFont("helvetica", "bold");
    doc.text(`For ${siteSettings?.businessName || "MakeMyPortal"}`, 196, finalY + 18, { align: "right" });

    // Check if order is paid
    if (order.status === 'completed' || order.status === 'delivered') {
        doc.setTextColor(34, 197, 94); // Green Text
        doc.setFontSize(16);
        doc.text("PAID IN FULL", 196, finalY + 28, { align: "right" });
        doc.setTextColor(0, 0, 0); // Reset
    } else {
        doc.setTextColor(239, 68, 68); // Red Text
        doc.setFontSize(16);
        doc.text("PAYMENT DUE", 196, finalY + 28, { align: "right" });
        doc.setTextColor(0, 0, 0); // Reset
    }

    doc.setFontSize(9);
    doc.text("Authorized Signatory", 196, finalY + 38, { align: "right" });

    // TERMS AND CONDITIONS FOOTER
    const footerY = doc.internal.pageSize.height - 25;
    doc.line(14, footerY - 5, 196, footerY - 5);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Terms and Conditions:", 14, footerY);
    doc.setFont("helvetica", "normal");
    doc.text("1. All disputes are subject to New Delhi jurisdiction.", 14, footerY + 5);
    doc.text("2. This is a computer-generated invoice and does not require a physical signature.", 14, footerY + 10);

    // BORDER RECTANGLE AROUND PAGE
    doc.setLineWidth(0.4);
    doc.rect(10, 10, 190, doc.internal.pageSize.height - 20);

    // TRIGGER DOWNLOAD WITH EXPLICIT EXTENSION
    doc.save(filename);
};
