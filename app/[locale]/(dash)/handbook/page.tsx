"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 

} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from "@hooks/useTheme";

const PdfViewerPage = () => {
  const t = useTranslations("PdfViewer");
  const theme = useTheme();


  // PDF file path - could also come from props or context
  const pdfPath = "https://efnu.fi/wp-content/uploads/EFNU_toimintakasikirja.pdf";


  return (
    <>
        <iframe
          src={pdfPath}
          style={{
          position: "absolute",
          bottom: "10vh",
          height: "90vh",
          width: "100vw",
          border: "none",
          margin: 0,
          padding: 0,
          display: "block"
        }}
        allowFullScreen
          title="PDF Viewer"
        />
    </>
  );
};

export default PdfViewerPage;