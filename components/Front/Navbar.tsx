"use client";

import React, { useContext } from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  useMediaQuery
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from "@mui/icons-material";
import { useTheme } from "@hooks/useTheme";
import NextLink from "next/link";
import NextImage from "next/image";
import { ColorModeContext } from "@contexts/color-mode";
import LanguageSwitcher from "@components/ui/LanguageSwitcher";


const Navbar = () => {
  const t = useTranslations("Navbar");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { mode, setMode } = useContext(ColorModeContext);

  const navItems = [
    { label: t("blog"), href: "/blog" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        backdropFilter: "blur(10px)",
        backgroundColor: theme.palette.mode === "dark" 
          ? "rgba(10, 10, 15, 0.8)" 
          : "rgba(255, 255, 255, 0.8)",
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 80,
            px: { xs: 2, sm: 0 }
          }}
        >
          {/* Logo */}
          <NextLink href="/home" passHref>
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <NextImage
                src={mode === 'light' ? "/Logolight.svg" : "/Logo.svg"}
                alt="Company Logo"
                width={140}
                height={140}
              />
            </Box>
          </NextLink>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Box sx={{ display: "flex", gap: 3 }}>
                {navItems.map((item) => (
                  <NextLink key={item.href} href={item.href} passHref>
                    <Button
                      sx={{
                        color: "text.primary",
                        fontWeight: 500,
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                          color: "primary.main"
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  </NextLink>
                ))}
              </Box>
              
              <IconButton onClick={() => setMode()}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              
              <LanguageSwitcher />
              <NextLink href="https://calendly.com/ekoforge" passHref>
                <Button
                  variant="contained"
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: "50px",
                    fontWeight: 600,
                    textTransform: "none"
                  }}
                >
                  {t("cta")}
                </Button>
              </NextLink>
            </Box>
          )}

          {/* Mobile Navigation Toggle */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LanguageSwitcher />
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Mobile Menu */}
        {isMobile && mobileOpen && (
          <Box
            sx={{
              position: "absolute",
              top: 80,
              left: 0,
              right: 0,
              backgroundColor: "background.paper",
              boxShadow: 3,
              px: 3,
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            {navItems.map((item) => (
              <NextLink key={item.href} href={item.href} passHref>
                <Button
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    py: 2,
                    color: "text.primary",
                    "&:hover": {
                      color: "primary.main"
                    }
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Button>
              </NextLink>
            ))}
            <NextLink href="https://calendly.com/ekoforge" passHref>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: "4px",
                  fontWeight: 600
                }}
                onClick={() => setMobileOpen(false)}
              >
                {t("cta")}
              </Button>
            </NextLink>
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                p: 1,
                mt: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.08)' 
                    : 'rgba(0,0,0,0.05)'
                }
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "text.secondary",
                  flexGrow: 1
                }}
              >
                {t("theme")}
              </Typography>
              
              <Box sx={{ 
                display: "flex", 
                alignItems: "center",
                gap: 1,
                position: 'relative',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(0,0,0,0.3)'
                  : 'rgba(0,0,0,0.05)'
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: mode === 'light' ? 'primary.main' : 'text.secondary',
                    cursor: 'pointer',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'all 0.2s ease',
                    minWidth: '80px',
                    justifyContent: 'center'
                  }}
                  onClick={() => mode !== 'light' && setMode()}
                >
                  <LightModeIcon fontSize="small" /> {t("light")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: mode === 'dark' ? 'primary.main' : 'text.secondary',
                    cursor: 'pointer',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'all 0.2s ease',
                    minWidth: '80px',
                    justifyContent: 'center'
                  }}
                  onClick={() => mode !== 'dark' && setMode()}
                >
                  <DarkModeIcon fontSize="small" /> {t("dark")}
                </Typography>
                
                <Box 
                  sx={{
                    position: 'absolute',
                    left: mode === 'light' ? 0 : '50%',
                    width: '50%',
                    height: '100%',
                    bgcolor: theme.palette.primary.light + '40',
                    borderRadius: 0.5,
                    zIndex: 0,
                    transition: 'left 0.3s ease'
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Navbar;
