document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('labelForm');
    const inputs = form.querySelectorAll('input, select');
    const btnPreview = document.getElementById('btnGeneratePreview');
    const btnExport = document.getElementById('btnExportPDF');
    
    // Khởi tạo label đầu tiên khi vừa load trang
    updatePreview();

    // Lắng nghe sự kiện thay đổi dữ liệu để update preview realtime
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    btnPreview.addEventListener('click', updatePreview);
    
    btnExport.addEventListener('click', () => {
        exportToPDF();
    });

    function getFormData() {
        return {
            category: document.getElementById('category').value,
            productName: document.getElementById('productName').value || '...',
            orderNo: document.getElementById('orderNo').value || '...',
            materialCode: document.getElementById('materialCode').value || '...',
            mfgDate: document.getElementById('mfgDate').value || '...',
            supplier: document.getElementById('supplier').value || '...',
            shippingDate: document.getElementById('shippingDate').value || '...',
            lotNo: document.getElementById('lotNo').value || '...',
            quantity: document.getElementById('quantity').value || '...',
            monthlyManagement: document.getElementById('monthlyManagement').value || '...',
            receiptDate: document.getElementById('receiptDate').value || '...',
            labelCount: parseInt(document.getElementById('labelCount').value) || 6
        };
    }

    function generateLabelHTML(data, idSuffix = '') {
        const check = (val) => data.category === val ? 'checked' : '';
        
        return `
            <div class="label-header">
                <div class="qr-code-box" id="qrcode-${idSuffix}"></div>
                <h3>信錦越南責任有限公司</h3>
                <h3>CÔNG TY TNHH SYNCMOLD VIỆT NAM</h3>
                <h3>FULFIL TECH CO., LTD</h3>
                <h1>物料標籤<br>Tem Vật liệu</h1>
                <div class="rohs-stamp">
                    RoHS2 HF<br><span>PASS</span>
                </div>
            </div>

            <div class="category-checkboxes">
                <div class="checkbox-item"><span class="checkbox-box ${check('muahang')}"></span> 採購 Mua hàng</div>
                <div class="checkbox-item"><span class="checkbox-box ${check('khcap')}"></span> 客供 KH cấp</div>
                <div class="checkbox-item"><span class="checkbox-box ${check('qlsx')}"></span> 制程 QLSX</div>
                <div class="checkbox-item"><span class="checkbox-box ${check('kho')}"></span> 倉存 Kho</div>
                <div class="checkbox-item"><span class="checkbox-box ${check('hangmau')}"></span> 樣品 Hàng mẫu</div>
                <div class="checkbox-item"><span class="checkbox-box ${check('uythac')}"></span> 委外 Ủy thác ngoài</div>
            </div>

            <table class="label-table">
                <tr>
                    <td style="width: 25%">品名<br>Tên SP</td>
                    <td style="width: 25%" class="bold-text">${data.productName}</td>
                    <td style="width: 25%">入庫單號<br>Mã đơn nhập kho<br>hoặc mã đơn hàng</td>
                    <td style="width: 25%" class="bold-text">${data.orderNo}</td>
                </tr>
                <tr>
                    <td>料號<br>Mã liệu</td>
                    <td class="bold-text">${data.materialCode}</td>
                    <td>生產日期<br>Ngày sản xuất</td>
                    <td class="bold-text">${data.mfgDate}</td>
                </tr>
                <tr>
                    <td>供應商<br>NCC</td>
                    <td class="bold-text">${data.supplier}</td>
                    <td>出貨日期<br>Ngày xuất hàng</td>
                    <td class="bold-text">${data.shippingDate}</td>
                </tr>
                <tr>
                    <td>材料類別<br>Loại vật liệu</td>
                    <td colspan="3" class="bold-text">Sản phẩm nhựa 塑膠產品</td>
                </tr>
                <tr>
                    <td>LOT.NO</td>
                    <td class="bold-text">${data.lotNo}</td>
                    <td>數量(Pcs) Số lượng</td>
                    <td class="bold-text">${data.quantity}</td>
                </tr>
                <tr>
                    <td>月份管理<br>Quản lý theo tháng</td>
                    <td>廠商檢驗章<br>Dấu KT của NCC</td>
                    <td colspan="2">信錦檢驗章<br>Dấu KT Sync Mold</td>
                </tr>
                <tr>
                    <td class="bold-text" style="height: 40px; vertical-align: middle;">${data.monthlyManagement}</td>
                    <td style="vertical-align: bottom; text-align: center;">${data.receiptDate}</td>
                    <td colspan="2"></td>
                </tr>
            </table>

            <div class="label-footer">
                <div>VNQR-IT03-201 Rev.A</div>
                <div>生效日期 Ngày có hiệu lực: 2020.10.01</div>
            </div>
        `;
    }

    function renderQRCode(elementId, text) {
        const el = document.getElementById(elementId);
        if(el) {
            el.innerHTML = '';
            // Sử dụng mã liệu hoặc mã đơn làm data cho QR code tạm thời
            const qrData = text && text !== '...' ? text : 'No Data';
            new QRCode(el, {
                text: qrData,
                width: 55,
                height: 55,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.L
            });
        }
    }

    function updatePreview() {
        const data = getFormData();
        const previewEl = document.getElementById('labelPreview');
        previewEl.innerHTML = generateLabelHTML(data, 'preview');
        
        // Render QR
        renderQRCode('qrcode-preview', data.orderNo + '|' + data.materialCode);
    }

    function exportToPDF() {
        const data = getFormData();
        const count = data.labelCount;
        const container = document.getElementById('a4PagesContainer');
        container.innerHTML = ''; // Clear cũ

        const labelsPerPage = 6;
        const pages = Math.ceil(count / labelsPerPage);
        
        let labelIndex = 0;

        for (let p = 0; p < pages; p++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'a4-page';
            
            for (let i = 0; i < labelsPerPage; i++) {
                if (labelIndex < count) {
                    const labelDiv = document.createElement('div');
                    labelDiv.className = 'label-template';
                    const uniqueSuffix = `print-${labelIndex}`;
                    labelDiv.innerHTML = generateLabelHTML(data, uniqueSuffix);
                    pageDiv.appendChild(labelDiv);
                    labelIndex++;
                }
            }
            container.appendChild(pageDiv);
        }

        // Tạo QR Code cho bản in
        for (let i = 0; i < count; i++) {
            renderQRCode(`qrcode-print-${i}`, data.orderNo + '|' + data.materialCode);
        }

        // Gọi lệnh in của trình duyệt sau 500ms để đảm bảo QR Code đã vẽ xong
        setTimeout(() => {
            window.print();
        }, 500);
    }
});
