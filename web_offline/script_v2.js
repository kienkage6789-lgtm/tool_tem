document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('labelForm');
    const inputs = form.querySelectorAll('input, select');
    const btnExport = document.getElementById('btnExportPDF');
    const previewEl = document.getElementById('labelPreview');
    const previewContainer = document.querySelector('.preview-container');
    const scaleInput = document.getElementById('labelScale');
    const scaleValue = document.getElementById('scaleValue');
    
    // UI Quản lý Template
    const templateSelect = document.getElementById('templateSelect');
    const btnSaveTemplate = document.getElementById('btnSaveTemplate');
    const btnUpdateTemplate = document.getElementById('btnUpdateTemplate');
    const btnDeleteTemplate = document.getElementById('btnDeleteTemplate');

    const TEMPLATE_STORAGE_KEY = 'syncmold_label_templates_v2';
    let templates = JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEY)) || {};



    // Khởi tạo label đầu tiên khi vừa load trang
    renderTemplateList();
    updateManualPreview();

    // Lắng nghe sự kiện thay đổi dữ liệu để update preview realtime
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateManualPreview();
        });
    });

    // Xử lý Scale Tem
    scaleInput.addEventListener('input', (e) => {
        const val = e.target.value;
        scaleValue.textContent = `${val}%`;
        document.documentElement.style.setProperty('--label-scale', val / 100);
    });

    function getFormData() {
        const labelTypeRadio = document.querySelector('input[name="labelType"]:checked');
        return {
            labelType: labelTypeRadio ? labelTypeRadio.value : 'box',
            category: document.getElementById('category').value,
            qrContent: document.getElementById('qrContent').value || '...',
            shift: document.getElementById('shift') ? document.getElementById('shift').value : 'A',
            subMaterialCode: document.getElementById('subMaterialCode') ? document.getElementById('subMaterialCode').value : '',
            startBoxNumber: document.getElementById('startBoxNumber') ? parseInt(document.getElementById('startBoxNumber').value) : 1,
            productName: document.getElementById('productName').value || '...',
            orderNo: document.getElementById('orderNo').value || '...',
            materialCode: document.getElementById('materialCode').value || '...',
            mfgDate: document.getElementById('mfgDate').value || '...',
            supplier: document.getElementById('supplier').value || '...',
            shippingDate: document.getElementById('shippingDate').value || '...',
            lotNo: document.getElementById('lotNo').value || '...',
            quantity: document.getElementById('quantity').value || '...',
            monthlyManagement: document.getElementById('monthlyManagement').value || '...',
            receiptDate: document.getElementById('receiptDate').value || '',
            receiptDateRight: document.getElementById('receiptDateRight') ? document.getElementById('receiptDateRight').value : '',
            labelCount: parseInt(document.getElementById('labelCount').value) || 6
        };
    }

    function generateDynamicQR(data, boxNumberIndex) {
        const materialCode = data.materialCode === '...' ? '' : data.materialCode;
        const lotNo = data.lotNo === '...' ? '' : data.lotNo;
        const shift = data.shift || 'A';
        // Xóa dấu gạch ngang ở cuối nếu người dùng lỡ nhập thừa để tránh bị trùng lặp 2 dấu gạch ngang
        let subMaterialCode = data.subMaterialCode || '';
        if (subMaterialCode.endsWith('-')) {
            subMaterialCode = subMaterialCode.slice(0, -1);
        }
        const quantityNum = parseInt(data.quantity) || 0;
        const quantityStr = String(quantityNum).padStart(6, '0');
        const boxNumStr = 'B' + String(boxNumberIndex).padStart(3, '0');
        
        return `${materialCode}-XP${lotNo}${shift}${subMaterialCode}-${boxNumStr}-${quantityStr}`;
    }



    function generateLabelHTML(data, idSuffix = '') {
        const check = (val) => data.category === val ? 'checked' : '';
        
        const displayMfgDate = data.mfgDate && data.mfgDate !== '...' ? data.mfgDate + '(' + (data.shift || 'A') + ')' : '...';
        const displayQuantity = data.quantity && data.quantity !== '...' ? data.quantity + ' Pcs' : '...';

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
                    <td colspan="2" style="width: 25%">品名<br>Tên SP</td>
                    <td colspan="2" style="width: 25%" class="bold-text">${data.productName}</td>
                    <td colspan="2" style="width: 25%">入庫單號<br>Mã đơn nhập kho<br>hoặc mã đơn hàng</td>
                    <td colspan="2" style="width: 25%" class="bold-text">${data.orderNo}</td>
                </tr>
                <tr>
                    <td colspan="2">料號<br>Mã liệu</td>
                    <td colspan="2" class="bold-text">${data.materialCode}</td>
                    <td colspan="2">生產日期<br>Ngày sản xuất</td>
                    <td colspan="2" class="bold-text">${displayMfgDate}</td>
                </tr>
                <tr>
                    <td colspan="2">供應商<br>NCC</td>
                    <td colspan="2" class="bold-text">${data.supplier}</td>
                    <td colspan="2">出貨日期<br>Ngày xuất hàng</td>
                    <td colspan="2" class="bold-text">${data.shippingDate}</td>
                </tr>
                <tr>
                    <td colspan="2">材料類別<br>Loại vật liệu</td>
                    <td colspan="6" class="bold-text">ADC12</td>
                </tr>
                <tr>
                    <td colspan="2">LOT.NO</td>
                    <td colspan="2" class="bold-text">${data.lotNo}</td>
                    <td colspan="2">數量(Pcs) Số lượng</td>
                    <td colspan="2" class="bold-text">${displayQuantity}</td>
                </tr>
                <tr>
                    <td colspan="2" style="width: 25%;">月份管理<br>Quản lý theo tháng</td>
                    <td colspan="3" style="width: 37.5%;">廠商檢驗章<br>Dấu KT của NCC</td>
                    <td colspan="3" style="width: 37.5%;">信錦檢驗章<br>Dấu KT Sync Mold</td>
                </tr>
                <tr>
                    <td colspan="2" class="bold-text" style="height: 40px; vertical-align: middle;">${data.monthlyManagement}</td>
                    <td colspan="3" style="vertical-align: bottom; padding: 2px 5px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-end; height: 100%; width: 100%; font-size: 0.9em; font-weight: bold;">
                            <span>${data.receiptDate && data.receiptDate !== '...' ? data.receiptDate : ''}</span>
                            <span>${data.receiptDateRight || ''}</span>
                        </div>
                    </td>
                    <td colspan="3"></td>
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

    function updateManualPreview() {
        const data = getFormData();
        const startBox = data.startBoxNumber || 1;
        data.qrContent = generateDynamicQR(data, startBox);
        
        const qrInput = document.getElementById('qrContent');
        if(qrInput) qrInput.value = data.qrContent;

        previewContainer.innerHTML = '';
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label-template';
        labelDiv.id = 'labelPreview';
        labelDiv.innerHTML = generateLabelHTML(data, 'preview');
        previewContainer.appendChild(labelDiv);
        
        renderQRCode('qrcode-preview', data.qrContent);
    }



    btnExport.addEventListener('click', () => {
        exportToPDF();
    });

    function exportToPDF() {
        let countToPrint = 0;
        let dataToPrint = [];

        const data = getFormData();
        countToPrint = data.labelCount;
        const startBox = data.startBoxNumber || 1;
        
        for (let i = 0; i < countToPrint; i++) {
            const labelData = { ...data };
            const currentBoxIndex = (data.labelType === 'bag') ? startBox : (startBox + i);
            labelData.qrContent = generateDynamicQR(data, currentBoxIndex);
            dataToPrint.push(labelData);
        }

        const container = document.getElementById('a4PagesContainer');
        container.innerHTML = ''; // Clear cũ

        const labelsPerPage = 6;
        const pages = Math.ceil(countToPrint / labelsPerPage);
        
        let labelIndex = 0;

        for (let p = 0; p < pages; p++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'a4-page';
            
            for (let i = 0; i < labelsPerPage; i++) {
                if (labelIndex < countToPrint) {
                    const labelDiv = document.createElement('div');
                    labelDiv.className = 'label-template';
                    const uniqueSuffix = `print-${labelIndex}`;
                    labelDiv.innerHTML = generateLabelHTML(dataToPrint[labelIndex], uniqueSuffix);
                    pageDiv.appendChild(labelDiv);
                    labelIndex++;
                }
            }
            container.appendChild(pageDiv);
        }

        // Tạo QR Code cho bản in
        for (let i = 0; i < countToPrint; i++) {
            renderQRCode(`qrcode-print-${i}`, dataToPrint[i].qrContent);
        }

        // Gọi lệnh in của trình duyệt sau 500ms
        setTimeout(() => {
            if (typeof require !== 'undefined') {
                const { ipcRenderer } = require('electron');
                ipcRenderer.send('preview-print');
            } else {
                window.print();
            }
        }, 500);
    }

    // --- Template Management Logic ---
    function renderTemplateList() {
        if (!templateSelect) return;
        templateSelect.innerHTML = '<option value="">-- Chọn mẫu đã lưu --</option>';
        for (const name in templates) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            templateSelect.appendChild(option);
        }
        btnUpdateTemplate.disabled = true;
        btnDeleteTemplate.disabled = true;
    }

    if (templateSelect) {
        templateSelect.addEventListener('change', () => {
            const name = templateSelect.value;
            if (name && templates[name]) {
                const data = templates[name];
                
                // set form values
                const setVal = (id, val) => {
                    const el = document.getElementById(id);
                    if (el) el.value = val;
                };

                const labelTypeRadios = document.getElementsByName('labelType');
                if (labelTypeRadios) {
                    labelTypeRadios.forEach(r => {
                        r.checked = (r.value === (data.labelType || 'box'));
                    });
                }

                setVal('category', data.category || '');
                setVal('shift', data.shift || 'A');
                setVal('subMaterialCode', data.subMaterialCode || '');
                setVal('startBoxNumber', data.startBoxNumber || '1');
                setVal('productName', data.productName === '...' ? '' : data.productName);
                setVal('orderNo', data.orderNo === '...' ? '' : data.orderNo);
                setVal('materialCode', data.materialCode === '...' ? '' : data.materialCode);
                setVal('mfgDate', data.mfgDate === '...' ? '' : data.mfgDate);
                setVal('supplier', data.supplier === '...' ? '' : data.supplier);
                setVal('shippingDate', data.shippingDate === '...' ? '' : data.shippingDate);
                setVal('lotNo', data.lotNo === '...' ? '' : data.lotNo);
                setVal('quantity', data.quantity === '...' ? '' : data.quantity);
                setVal('monthlyManagement', data.monthlyManagement === '...' ? '' : data.monthlyManagement);
                setVal('receiptDate', data.receiptDate === '...' ? '' : data.receiptDate);
                setVal('receiptDateRight', data.receiptDateRight || '');
                setVal('labelCount', data.labelCount || '6');

                btnUpdateTemplate.disabled = false;
                btnDeleteTemplate.disabled = false;
                
                updateManualPreview();
            } else {
                btnUpdateTemplate.disabled = true;
                btnDeleteTemplate.disabled = true;
            }
        });
    }

    let saveTimeout = null;
    let pendingSaveName = null;

    if (btnSaveTemplate) {
        btnSaveTemplate.addEventListener('click', () => {
            const nameInput = document.getElementById('newTemplateName');
            const name = nameInput ? nameInput.value.trim() : '';
            if (!name) {
                if (nameInput) {
                    nameInput.style.borderColor = 'red';
                    setTimeout(() => nameInput.style.borderColor = '#ccc', 2000);
                    nameInput.focus();
                }
                return;
            }
            if (templates[name] && pendingSaveName !== name) {
                pendingSaveName = name;
                const originalText = btnSaveTemplate.textContent;
                btnSaveTemplate.textContent = 'Ghi đè? (Bấm lại)';
                btnSaveTemplate.style.backgroundColor = '#e67e22';
                
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    pendingSaveName = null;
                    btnSaveTemplate.textContent = originalText;
                    btnSaveTemplate.style.backgroundColor = '#3498db';
                }, 3000);
                return;
            }
            
            pendingSaveName = null;
            clearTimeout(saveTimeout);

            const dataToSave = getFormData();
            for (const key in dataToSave) {
                if (dataToSave[key] === '...') dataToSave[key] = '';
            }
            templates[name] = dataToSave;
            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
            renderTemplateList();
            templateSelect.value = name;
            templateSelect.dispatchEvent(new Event('change'));
            nameInput.value = ''; 
            
            const originalText = btnSaveTemplate.textContent;
            btnSaveTemplate.textContent = 'Đã lưu ✔';
            btnSaveTemplate.style.backgroundColor = '#27ae60';
            setTimeout(() => {
                btnSaveTemplate.textContent = originalText;
                btnSaveTemplate.style.backgroundColor = '#3498db';
            }, 2000);
        });
    }

    if (btnUpdateTemplate) {
        btnUpdateTemplate.addEventListener('click', () => {
            const name = templateSelect.value;
            if (name && templates[name]) {
                const dataToSave = getFormData();
                for (const key in dataToSave) {
                    if (dataToSave[key] === '...') dataToSave[key] = '';
                }
                templates[name] = dataToSave;
                localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
                
                const originalText = btnUpdateTemplate.textContent;
                btnUpdateTemplate.textContent = 'Đã cập nhật ✔';
                setTimeout(() => {
                    btnUpdateTemplate.textContent = originalText;
                }, 2000);
            }
        });
    }

    let deleteTimeout = null;
    let pendingDeleteName = null;

    if (btnDeleteTemplate) {
        btnDeleteTemplate.addEventListener('click', () => {
            const name = templateSelect.value;
            if (name && templates[name]) {
                if (pendingDeleteName !== name) {
                    pendingDeleteName = name;
                    const originalText = btnDeleteTemplate.textContent;
                    btnDeleteTemplate.textContent = 'Xóa chắc chưa?';
                    
                    clearTimeout(deleteTimeout);
                    deleteTimeout = setTimeout(() => {
                        pendingDeleteName = null;
                        btnDeleteTemplate.textContent = originalText;
                    }, 3000);
                    return;
                }
                
                pendingDeleteName = null;
                clearTimeout(deleteTimeout);
                
                delete templates[name];
                localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
                renderTemplateList();
                btnDeleteTemplate.textContent = 'Xóa Mẫu';
            }
        });
    }
    const btnExportBackup = document.getElementById('btnExportBackup');
    const btnImportBackup = document.getElementById('btnImportBackup');
    const importBackupFile = document.getElementById('importBackupFile');

    if (btnExportBackup) {
        btnExportBackup.addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "DEZEN_Templates_Backup.json");
            document.body.appendChild(downloadAnchorNode); 
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            
            const originalText = btnExportBackup.textContent;
            btnExportBackup.textContent = 'Đã tải xong ✔';
            setTimeout(() => { btnExportBackup.textContent = originalText; }, 2000);
        });
    }

    if (btnImportBackup && importBackupFile) {
        btnImportBackup.addEventListener('click', () => {
            importBackupFile.click();
        });

        importBackupFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    if (typeof importedData === 'object' && importedData !== null) {
                        Object.assign(templates, importedData);
                        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
                        renderTemplateList();
                        
                        const originalText = btnImportBackup.textContent;
                        btnImportBackup.textContent = 'Đã nạp thành công ✔';
                        btnImportBackup.style.backgroundColor = '#27ae60';
                        setTimeout(() => { 
                            btnImportBackup.textContent = originalText;
                            btnImportBackup.style.backgroundColor = '#8e44ad';
                        }, 2000);
                    } else {
                        throw new Error('Dữ liệu lỗi');
                    }
                } catch (err) {
                    const originalText = btnImportBackup.textContent;
                    btnImportBackup.textContent = 'File không đúng ✖';
                    btnImportBackup.style.backgroundColor = '#c0392b';
                    setTimeout(() => { 
                        btnImportBackup.textContent = originalText; 
                        btnImportBackup.style.backgroundColor = '#8e44ad';
                    }, 2000);
                }
                importBackupFile.value = '';
            };
            reader.readAsText(file);
        });
    }
});
