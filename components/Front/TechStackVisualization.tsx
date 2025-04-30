"use client";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Grid,
  styled
} from '@mui/material';
import { useTranslations } from 'next-intl';

const GradientBox = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  overflow: 'hidden',
}));

const TechStackVisualization = () => {
  const ref = useRef(null);
  const t = useTranslations("Home");  
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const metrics = [
    { value: '4.3x', label: t('PerformanceBoost'), color: '#3ECF8E' },
    { value: '99.9%', label: t('Uptime'), color: '#007FFF' },
    { value: '99.2%', label: t('Responsiveness'), color: '#61DAFB' },
    { value: '98.7%', label: t('SEO'), color: '#EB5424' }
  ];

  const ToolsStack = [
    `NextJS`,
    `TypeScript`,
    `Refine`,
    `MUI`,
    `Supabase`,
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <GradientBox
        sx={{ p: 4, maxWidth: '1000px', mx: 'auto' }}
      >
        {/* Technical grid overlay */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          color: (theme) => theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300'
        }} />

        {/* Glowing elements */}
        <Box sx={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 256,
          height: 256,
          borderRadius: '50%',
          bgcolor: 'primary.light',
          filter: 'blur(48px)',
          opacity: 0.1
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 256,
          height: 256,
          borderRadius: '50%',
          bgcolor: 'success.light',
          filter: 'blur(48px)',
          opacity: 0.1
        }} />

        <Grid container spacing={4} position="relative" zIndex={1}>
          {/* Results metrics */}
          <Grid item xs={12} md={12}>
            
            <Grid container spacing={2}>
              {metrics.map((metric, i) => (
                <Grid item xs={6} key={metric.label}>
                  <Paper
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { 
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.1 + 0.3 }
                    } : {}}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      backdropFilter: 'blur(8px)',
                      border: (theme) => `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      component="div" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        color: metric.color 
                      }}
                    >
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography 
            variant="h5" 
            component="div" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mt: 4
            }}
          >
            
          </Typography>
        </Grid>

        {/* Floating tech badges */}
        <Box sx={{ 
          position: 'absolute',
          bottom: 16,
          right: 16,
          display: 'flex',
          gap: 1
        }}>
          {ToolsStack.map((tech, i) => (
            <Paper
              key={tech}
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? {
                y: 0,
                opacity: 0.8,
                transition: { delay: 0.8 + i * 0.1 }
              } : {}}
              sx={{
                px: 2,
                py: 1,
                fontSize: '0.75rem',
                borderRadius: 4,
                bgcolor: 'background.paper',
                backdropFilter: 'blur(8px)',
                border: (theme) => `1px solid ${theme.palette.divider}`
              }}
            >
              {tech}
            </Paper>
          ))}
        </Box>
      </GradientBox>
    </motion.div>
  );
};

export default TechStackVisualization;