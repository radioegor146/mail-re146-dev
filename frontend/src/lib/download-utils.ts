export function downloadBlob(data: Uint8Array, fileName: string, mimeType: string): void {
    const blob = new Blob([data], {
        type: mimeType
    });
    const url = window.URL.createObjectURL(blob);
    downloadURL(url, fileName);
    setTimeout(function () {
        return window.URL.revokeObjectURL(url);
    }, 1000);
}

export function downloadURL(url: string, fileName: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
}