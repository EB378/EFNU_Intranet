"use client";

import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { useTranslations } from "next-intl";

const RWYLightsPage: React.FC = () => {
  const t = useTranslations("RunwayLights");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="h-screen w-full flex flex-col bg-gray-900 relative overflow-y-auto"
    >
      {/* Header */}
      <Typography 
        variant="h4"
        component={motion.h1}
        sx={{
          p: 4,
          position: 'relative',
          top: 0,
          left: 0,
          background: 'linear-gradient(45deg, #00e5ff, #0066ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          zIndex: 10,
        }}
      >
        {t("title")}
      </Typography>

      {/* Main Content Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          gap: 4,
        }}
      >
        {/* Video Container */}
        <motion.div
          className="relative"
          style={{
            maxWidth: '90vw',
            width: '100%',
            aspectRatio: '16/9',
          }}
          whileHover={{ scale: 1.02 }}
        >
          <video
            controls
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 0 40px -10px rgba(34, 211, 238, 0.5)',
            }}
            title={t("videoTitle")}
          >
            <source
              src="https://efnu.fi/wp-content/uploads/efnu-lights-guide-2023-10-11.mp4"
              type="video/mp4"
            />
            {t("videoNotSupported")}
          </video>
        </motion.div>

        {/* Night Operations Information */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '800px',
            bgcolor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '12px',
            p: 4,
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: '#38bdf8', mb: 2 }}>
            {t("nightOperations.title")}
          </Typography>

          <List dense>
            <ListItem>
              <ListItemText
                primary={t("nightOperations.taxiwayNotInUse")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("nightOperations.noTaxiwayLights")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("nightOperations.runwayLightsInfo")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ color: '#38bdf8', mt: 3, mb: 2 }}>
            {t("lightControl.title")}
          </Typography>

          <List dense>
            <ListItem>
              <ListItemText
                primary={t("lightControl.frequency")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("lightControl.operationRange")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("lightControl.timingRequirements")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ color: '#38bdf8', mt: 3, mb: 2 }}>
            {t("lightOperation.title")}
          </Typography>

          <List dense>
            <ListItem>
              <ListItemText
                primary={t("lightOperation.activation")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("lightOperation.announcements")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("lightOperation.flashingWarning")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("lightOperation.dimming")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("lightControl.timeExtension")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={t("lightControl.faultIndicators")}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </motion.div>
  );
};

export default RWYLightsPage;