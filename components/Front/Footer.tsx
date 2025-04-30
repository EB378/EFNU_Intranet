"use client";

import React, { useContext } from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useTheme } from "@hooks/useTheme";
import NextLink from "next/link";
import NextImage from "next/image";
import { ColorModeContext } from "@contexts/color-mode";

// Footer Component
const Footer = () => {
  const t = useTranslations("Footer");
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const { mode } = useContext(ColorModeContext);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.paper",
        borderTop: `1px solid ${theme.palette.divider}`,
        pt: 8,
        pb: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <NextLink href="/" passHref>
              <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <NextImage
                  src={mode === 'light' ? "/Logolight.svg" : "/Logo.svg"}
                  alt="Company Logo"
                  width={180}
                  height={80}
                />
              </Box>
            </NextLink>
            <Typography variant="body2" color="text.secondary">
              {t("description")}
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t("company")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1.5 }}>
                <NextLink href="/about" passHref>
                  <Typography
                    
                    color="text.secondary"
                    sx={{
                      "&:hover": {
                        color: "primary.main"
                      }
                    }}
                  >
                    {t("about")}
                  </Typography>
                </NextLink>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <NextLink href="/careers" passHref>
                  <Typography
                    
                    color="text.secondary"
                    sx={{
                      "&:hover": {
                        color: "primary.main"
                      }
                    }}
                  >
                    {t("careers")}
                  </Typography>
                </NextLink>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <NextLink href="/blog" passHref>
                  <Typography
                    
                    color="text.secondary"
                    sx={{
                      "&:hover": {
                        color: "primary.main"
                      }
                    }}
                  >
                    {t("blog")}
                  </Typography>
                </NextLink>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t("resources")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1.5 }}>
                <NextLink href="/pricing" passHref>
                  <Typography
                    
                    color="text.secondary"
                    sx={{
                      "&:hover": {
                        color: "primary.main"
                      }
                    }}
                  >
                    {t("pricing")}
                  </Typography>
                </NextLink>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <NextLink href="/dash" passHref>
                  <Typography
                    
                    color="text.secondary"
                    sx={{
                      "&:hover": {
                        color: "primary.main"
                      }
                    }}
                  >
                    {t("company_portal")}
                  </Typography>
                </NextLink>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <NextLink href="/support" passHref>
                  <Typography
                    
                    color="text.secondary"
                    sx={{
                      "&:hover": {
                        color: "primary.main"
                      }
                    }}
                  >
                    {t("support")}
                  </Typography>
                </NextLink>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {t("contact")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              <Box 
                component="li" 
                sx={{ 
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5
                }}
              >
                <PhoneIcon color="primary" fontSize="small" />
                <Typography color="text.secondary">
                  +358 44 241 3840
                </Typography>
              </Box>
              <Box 
                component="li" 
                sx={{ 
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5
                }}
              >
                <EmailIcon color="primary" fontSize="small" />
                <Typography color="text.secondary">
                  ekoforge@gmail.com
                </Typography>
              </Box>
              <Box 
                component="li" 
                sx={{ 
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5
                }}
              >
                <LocationIcon color="primary" fontSize="small" />
                <Typography color="text.secondary">
                  Helsinki, Finland
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} EkoForge. {t("rights")}
          </Typography>
          <Box sx={{ display: "flex", gap: 3, mt: { xs: 2, sm: 0 } }}>
            <NextLink href="/privacy" passHref>
              <Typography
                
                variant="body2"
                color="text.secondary"
                sx={{
                  "&:hover": {
                    color: "primary.main"
                  }
                }}
              >
                {t("privacy")}
              </Typography>
            </NextLink>
            <NextLink href="/terms" passHref>
              <Typography
                
                variant="body2"
                color="text.secondary"
                sx={{
                  "&:hover": {
                    color: "primary.main"
                  }
                }}
              >
                {t("terms")}
              </Typography>
            </NextLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
