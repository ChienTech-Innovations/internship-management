declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  interface AutoTableOptions {
    startY?: number;
    head?: string[][];
    body?: string[][];
    theme?: string;
    headStyles?: {
      fillColor?: number[];
    };
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void;
  export = autoTable;
}

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}
