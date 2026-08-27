export function generateMockPdfBlob(title: string, subtitle: string, fields: Array<{ label: string; value: string }>) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
        .header { border-bottom: 2px solid #0f4c3a; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 20px; font-weight: bold; color: #0b2341; }
        .gov-sub { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
        .stamp { border: 2px solid #10b981; color: #047857; font-weight: bold; padding: 6px 12px; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; color: #0b2341; }
        .subtitle { font-size: 12px; color: #64748b; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 12px; }
        th { background-color: #f8fafc; font-weight: bold; color: #334155; }
        .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; pt-10px; font-size: 10px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">INCOME TAX DEPARTMENT</div>
          <div class="gov-sub">GOVERNMENT OF INDIA • OFFICIAL ACKNOWLEDGEMENT</div>
        </div>
        <div class="stamp">VERIFIED & RECORDED</div>
      </div>
      <div class="title">${title}</div>
      <div class="subtitle">${subtitle}</div>
      <table>
        <thead>
          <tr>
            <th>Field Description</th>
            <th>Taxpayer Record Value</th>
          </tr>
        </thead>
        <tbody>
          ${fields.map((f) => `<tr><td><strong>${f.label}</strong></td><td>${f.value}</td></tr>`).join('')}
        </tbody>
      </table>
      <div class="footer">
        This is an official synthetic prototype document generated for Hackathon Verification. No manual signature required.
      </div>
    </body>
    </html>
  `;

  const windowRef = window.open('', '_blank');
  if (windowRef) {
    windowRef.document.write(htmlContent);
    windowRef.document.close();
    setTimeout(() => {
      windowRef.print();
    }, 500);
  }
}
