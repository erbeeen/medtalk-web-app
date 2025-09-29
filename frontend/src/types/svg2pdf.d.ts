declare module 'svg2pdf.js' {
  const svg2pdf: (
    svgElement: SVGElement,
    pdf: any,
    options?: {
      xOffset?: number;
      yOffset?: number;
      scale?: number;
    }
  ) => Promise<void>;

  export default svg2pdf;
}
