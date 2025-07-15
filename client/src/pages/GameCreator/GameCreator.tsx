import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { SportsEsports } from '@mui/icons-material';
import { motion } from 'framer-motion';

const GameCreator: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Game Creator
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Build interactive games with AI assistance
        </Typography>
      </motion.div>

      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <SportsEsports sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The Game Creator feature is under development. You'll be able to create amazing games with AI assistance.
          </Typography>
          <Button variant="contained" size="large">
            Get Notified
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GameCreator;