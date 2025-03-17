$(document).ready(function() {
    // 变量初始化
    let originalFile = null;
    let originalFormat = '';
    
    // 上传按钮点击事件
    $('#uploadBtn').on('click', function() {
        $('#fileInput').click();
    });
    
    // 文件选择事件
    $('#fileInput').on('change', function(e) {
        if (this.files && this.files[0]) {
            handleFile(this.files[0]);
        }
    });
    
    // 处理上传的文件
    function handleFile(file) {
        originalFile = file;
        
        // 检查是否为有效的图片文件
        const validTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('请上传有效的图片文件（JPG, PNG, BMP, WEBP, GIF）');
            return;
        }
        
        // 显示加载动画
        showLoading();
        
        // 获取并显示原始格式
        originalFormat = file.type.split('/')[1].toUpperCase();
        if (originalFormat === 'JPEG') originalFormat = 'JPG';
        $('#originalFormat').text(originalFormat);
        
        // 设置原文件类型下拉框的值
        const formatMapping = {
            'JPG': 'jpg',
            'PNG': 'png',
            'BMP': 'bmp',
            'WEBP': 'webp',
            'GIF': 'gif'
        };
        
        $('#originalFormatSelect').val(formatMapping[originalFormat]);
        
        // 显示图片尺寸和文件大小
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                $('#imageSize').text(`${this.width} × ${this.height} 像素`);
                $('#previewImage').attr('src', e.target.result);
                $('#previewContainer').show();
                $('#actionButtons').show();
                
                // 隐藏加载动画
                hideLoading();
                
                // 默认选择不同于原始格式的转换格式
                const formatSelect = $('#formatSelect');
                formatSelect.val(originalFormat.toLowerCase() === 'png' ? 'jpeg' : 'png');
                
                // 滚动到预览区域
                $('html, body').animate({
                    scrollTop: $('#previewContainer').offset().top - 20
                }, 300);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // 显示文件大小
        const fileSizeInKB = Math.round(file.size / 1024);
        const fileSizeInMB = fileSizeInKB > 1024 ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : fileSizeInKB + ' KB';
        $('#fileSize').text(fileSizeInMB);
    }
    
    // 转换按钮点击事件
    $('#convertBtn').on('click', function() {
        if (!originalFile) {
            alert('请先上传图片');
            return;
        }
        
        // 显示加载动画
        showLoading();
        
        const targetFormat = $('#formatSelect').val();
        
        // 创建Canvas以转换图片
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                // 根据目标格式转换图片
                let convertedImageSrc;
                let fileName = originalFile.name.split('.')[0];
                
                // 根据选择的格式确定MIME类型和文件扩展名
                const mimeTypes = {
                    'png': 'image/png',
                    'jpeg': 'image/jpeg',
                    'bmp': 'image/bmp',
                    'webp': 'image/webp',
                    'gif': 'image/gif'
                };
                
                // 注意：某些格式如GIF可能不支持完全转换，特别是保留动画效果
                convertedImageSrc = canvas.toDataURL(mimeTypes[targetFormat], 1.0); // 质量参数1.0确保不压缩
                
                // 显示转换后的图片
                $('#resultImage').attr('src', convertedImageSrc);
                $('#resultContainer').show();
                
                // 隐藏加载动画
                hideLoading();
                
                // 自动触发下载
                const downloadLink = document.createElement('a');
                downloadLink.href = convertedImageSrc;
                downloadLink.download = `${fileName}.${targetFormat}`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                // 滚动到结果区域
                $('html, body').animate({
                    scrollTop: $('#resultContainer').offset().top - 20
                }, 300);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(originalFile);
    });
    
    // 创建和显示加载动画
    function showLoading() {
        // 如果已经存在加载动画，先移除
        hideLoading();
        
        const loadingHtml = `
            <div class="loading-overlay">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-pulse"></i>
                    <p>处理中...</p>
                </div>
            </div>
        `;
        
        $('body').append(loadingHtml);
    }
    
    // 隐藏加载动画
    function hideLoading() {
        $('.loading-overlay').remove();
    }
}); 
