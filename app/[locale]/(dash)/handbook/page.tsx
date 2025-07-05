"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { 
  Box, 
  Container, 
  Typography, 
  Button,
  useMediaQuery 
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from "@hooks/useTheme";

const PdfViewerPage = () => {
  const t = useTranslations("PdfViewer");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // PDF file path - could also come from props or context
  const pdfPath = "https://efnu.fi/wp-content/uploads/EFNU_toimintakasikirja.pdf";

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '90vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative'
    }}>

      {/* PDF Viewer */}
      <Box sx={{
        flex: 1,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <iframe
          src={`${pdfPath}#view=fitH`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
          allowFullScreen
          title={t("pdfTitle")}
        />
      </Box>

      {/* Mobile warning if needed */}
      {isMobile && (
        <Box sx={{
          position: 'absolute',
          bottom: '10vh',
          left: 0,
          right: 0,
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.contrastText,
          p: 1,
          textAlign: 'center',
          zIndex: 2
        }}>
          <Typography variant="caption">
            {t("mobileWarning")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PdfViewerPage;