import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Configure your preferences
        </Typography>
      </motion.div>

      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <SettingsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The Settings feature is under development. You'll be able to configure your preferences and platform settings.
          </Typography>
          <Button variant="contained" size="large">
            Get Notified
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;