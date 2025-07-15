import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Slider,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Download,
  Save,
  Refresh,
  MusicNote,
  VolumeUp,
  VolumeOff,
  Speed,
  Loop,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

interface MusicGenerationRequest {
  prompt: string;
  genre: string;
  mood: string;
  duration: number;
  tempo: number;
  key: string;
  instruments: string[];
  includeVocals: boolean;
  complexity: 'simple' | 'medium' | 'complex';
}

interface GeneratedMusic {
  audioUrl: string;
  metadata: {
    genre: string;
    mood: string;
    duration: number;
    bpm: number;
    key: string;
    instruments: string[];
  };
  timestamp: string;
  waveform: number[];
}

const MusicComposer: React.FC = () => {
  const theme = useTheme();
  const socket = useSocket();
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [request, setRequest] = useState<MusicGenerationRequest>({
    prompt: '',
    genre: 'electronic',
    mood: 'energetic',
    duration: 120,
    tempo: 120,
    key: 'C',
    instruments: ['synth', 'drums'],
    includeVocals: false,
    complexity: 'medium',
  });
  
  const [generatedMusic, setGeneratedMusic] = useState<GeneratedMusic | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);

  const genres = [
    { value: 'electronic', label: 'Electronic', icon: '⚡' },
    { value: 'rock', label: 'Rock', icon: '🎸' },
    { value: 'pop', label: 'Pop', icon: '🎤' },
    { value: 'jazz', label: 'Jazz', icon: '🎷' },
    { value: 'classical', label: 'Classical', icon: '🎻' },
    { value: 'hip-hop', label: 'Hip Hop', icon: '🎧' },
    { value: 'ambient', label: 'Ambient', icon: '🌊' },
    { value: 'country', label: 'Country', icon: '🤠' },
    { value: 'reggae', label: 'Reggae', icon: '🌴' },
    { value: 'blues', label: 'Blues', icon: '🎵' },
  ];

  const moods = [
    { value: 'energetic', label: 'Energetic', icon: '⚡' },
    { value: 'calm', label: 'Calm', icon: '😌' },
    { value: 'melancholic', label: 'Melancholic', icon: '😔' },
    { value: 'happy', label: 'Happy', icon: '😊' },
    { value: 'mysterious', label: 'Mysterious', icon: '🔮' },
    { value: 'romantic', label: 'Romantic', icon: '💕' },
    { value: 'epic', label: 'Epic', icon: '🏛️' },
    { value: 'funky', label: 'Funky', icon: '🕺' },
  ];

  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const availableInstruments = [
    'piano', 'guitar', 'bass', 'drums', 'synth', 'strings', 'brass', 'woodwinds',
    'percussion', 'vocals', 'choir', 'organ', 'harp', 'violin', 'cello', 'flute'
  ];

  useEffect(() => {
    if (socket) {
      socket.on('music-generation-progress', (data) => {
        setProgress(data.progress);
        setProgressMessage(data.message);
      });

      socket.on('music-generation-complete', (data) => {
        setGeneratedMusic({
          audioUrl: data.audioUrl,
          metadata: data.metadata,
          timestamp: data.timestamp,
          waveform: Array.from({ length: 100 }, () => Math.random()),
        });
        setIsGenerating(false);
        setProgress(100);
        setSuccess('Music generated successfully!');
      });

      socket.on('ai-generation-error', (data) => {
        setError(data.error);
        setIsGenerating(false);
        setProgress(0);
      });

      return () => {
        socket.off('music-generation-progress');
        socket.off('music-generation-complete');
        socket.off('ai-generation-error');
      };
    }
  }, [socket]);

  const handleGenerate = () => {
    if (!request.prompt.trim()) {
      setError('Please enter a description of the music you want to generate.');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setProgressMessage('Starting music generation...');
    setError(null);
    setGeneratedMusic(null);
    setIsPlaying(false);

    if (socket) {
      socket.emit('music-generation-request', {
        ...request,
        userId: user?.id,
      });
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    if (generatedMusic) {
      const link = document.createElement('a');
      link.href = generatedMusic.audioUrl;
      link.download = `generated-music-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccess('Music downloaded successfully!');
    }
  };

  const handleSaveProject = () => {
    if (generatedMusic) {
      // TODO: Implement save to projects
      setSuccess('Project saved successfully!');
    }
  };

  const handleInstrumentToggle = (instrument: string) => {
    setRequest(prev => ({
      ...prev,
      instruments: prev.instruments.includes(instrument)
        ? prev.instruments.filter(i => i !== instrument)
        : [...prev.instruments, instrument]
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Music Composer
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Create original music with AI assistance
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ height: 'fit-content' }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Compose Music
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Describe the music you want to create"
                  placeholder="e.g., An upbeat electronic track with synth melodies and driving drums for a workout playlist"
                  value={request.prompt}
                  onChange={(e) => setRequest({ ...request, prompt: e.target.value })}
                  sx={{ mb: 3 }}
                />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Genre</InputLabel>
                      <Select
                        value={request.genre}
                        label="Genre"
                        onChange={(e) => setRequest({ ...request, genre: e.target.value })}
                      >
                        {genres.map((genre) => (
                          <MenuItem key={genre.value} value={genre.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{genre.icon}</span>
                              {genre.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Mood</InputLabel>
                      <Select
                        value={request.mood}
                        label="Mood"
                        onChange={(e) => setRequest({ ...request, mood: e.target.value })}
                      >
                        {moods.map((mood) => (
                          <MenuItem key={mood.value} value={mood.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{mood.icon}</span>
                              {mood.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Key</InputLabel>
                      <Select
                        value={request.key}
                        label="Key"
                        onChange={(e) => setRequest({ ...request, key: e.target.value })}
                      >
                        {keys.map((key) => (
                          <MenuItem key={key} value={key}>
                            {key}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Duration: {request.duration}s
                    </Typography>
                    <Slider
                      value={request.duration}
                      onChange={(_, value) => setRequest({ ...request, duration: value as number })}
                      min={30}
                      max={300}
                      step={30}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Tempo: {request.tempo} BPM
                    </Typography>
                    <Slider
                      value={request.tempo}
                      onChange={(_, value) => setRequest({ ...request, tempo: value as number })}
                      min={60}
                      max={200}
                      step={5}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Instruments
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {availableInstruments.map((instrument) => (
                    <Chip
                      key={instrument}
                      label={instrument}
                      onClick={() => handleInstrumentToggle(instrument)}
                      color={request.instruments.includes(instrument) ? 'primary' : 'default'}
                      variant={request.instruments.includes(instrument) ? 'filled' : 'outlined'}
                      clickable
                    />
                  ))}
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={request.includeVocals}
                      onChange={(e) => setRequest({ ...request, includeVocals: e.target.checked })}
                    />
                  }
                  label="Include Vocals"
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={handleGenerate}
                  disabled={isGenerating || !request.prompt.trim()}
                  sx={{ mb: 2 }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Music'}
                </Button>

                {isGenerating && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {progressMessage}
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {progress}% complete
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Output Section */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ height: 'fit-content' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Generated Music
                  </Typography>
                  {generatedMusic && (
                    <Box>
                      <Tooltip title="Download Music">
                        <IconButton onClick={handleDownload} size="small">
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Save Project">
                        <IconButton onClick={handleSaveProject} size="small">
                          <Save />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {generatedMusic ? (
                  <Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={generatedMusic.metadata.genre} color="primary" />
                      <Chip label={generatedMusic.metadata.mood} variant="outlined" />
                      <Chip label={`${generatedMusic.metadata.bpm} BPM`} variant="outlined" />
                      <Chip label={generatedMusic.metadata.key} variant="outlined" />
                    </Box>

                    {/* Audio Player */}
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <audio
                        ref={audioRef}
                        src={generatedMusic.audioUrl}
                        onEnded={() => setIsPlaying(false)}
                        style={{ display: 'none' }}
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <IconButton
                          onClick={handlePlayPause}
                          size="large"
                          color="primary"
                        >
                          {isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <IconButton onClick={handleStop} size="large">
                          <Stop />
                        </IconButton>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {Math.floor(generatedMusic.metadata.duration / 60)}:
                            {(generatedMusic.metadata.duration % 60).toString().padStart(2, '0')}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VolumeUp />
                          <Slider
                            value={volume}
                            onChange={(_, value) => {
                              setVolume(value as number);
                              if (audioRef.current) {
                                audioRef.current.volume = value as number;
                              }
                            }}
                            min={0}
                            max={1}
                            step={0.1}
                            sx={{ width: 100 }}
                          />
                        </Box>
                      </Box>

                      {/* Waveform Visualization */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: 60 }}>
                        {generatedMusic.waveform.map((height, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 2,
                              height: `${height * 60}px`,
                              bgcolor: 'primary.main',
                              borderRadius: 1,
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>

                    <Typography variant="body2" color="text.secondary">
                      Generated on {new Date(generatedMusic.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 8,
                      color: 'text.secondary',
                    }}
                  >
                    <MusicNote sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      No music generated yet
                    </Typography>
                    <Typography variant="body2">
                      Describe the music you want to create and click "Generate Music"
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MusicComposer;