(document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('predictForm');
    if (!form) return;
    const fileInput = document.getElementById('fileUpload');
    const result = document.getElementById('result');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!fileInput.files.length) {
            alert('no files selected');
            return;
        }
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        result.textContent = 'Processing...';
        try {
            const resp = await fetch('/api/predict', { method: 'POST', body: formData });
            const data = await resp.json();
            if (!resp.ok) {
                result.textContent = data.error || 'Error';
                return;
            }
            const imgURL = URL.createObjectURL(fileInput.files[0]);
            result.innerHTML = `
                <img src="${imgURL}" class="img-fluid mb-3" style="max-width:300px;">
                <p>ชื่อยา: ${data.name}</p>
                <p>ขนาด: ${data.dose}</p>
                <p>ค่าความถูกต้อง: ${data.score}%</p>
            `;
        } catch (err) {
            result.textContent = 'Error';
            console.error(err);
        }
    });
}));
