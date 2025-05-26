export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export function previewBase64Image(base64: string) {
  if (!base64?.startsWith("data:image/")) return "";

  const newTab = window.open();
  if (newTab) {
    newTab.document.write(`
      <html>
        <head><title>Image Preview</title></head>
        <body style="margin:0;">
          <img src="${base64}" style="max-width:100vw; max-height:100vh; display:block; margin:auto;" />
        </body>
      </html>
    `);
    newTab.document.close();
  }
}