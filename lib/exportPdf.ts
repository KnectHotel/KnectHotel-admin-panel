
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


export async function exportElementToPdf(selector: string, filename: string) {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) throw new Error(`Element not found: ${selector}`);

  
  await new Promise((r) => setTimeout(r, 100));

  const canvas = await html2canvas(el, {
    scale: 2,           
    useCORS: true,      
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  
  const pdf = new jsPDF('p', 'pt', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = - (imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
