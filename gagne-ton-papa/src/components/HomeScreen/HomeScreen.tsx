import { useEffect, useRef, type KeyboardEvent } from 'react';
import styles from './HomeScreen.module.css';

interface HomeScreenProps {
  onPlay: () => void;
}

export function HomeScreen({ onPlay }: HomeScreenProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch((err) => {
          console.warn('Audio auto-play prevented. Awaiting user interaction.', err);
        });
      }
    };

    // Attempt to play immediately
    playAudio();

    // Attach listeners to start audio on the first user interaction
    const events = ['click', 'keydown', 'touchstart'];
    const handleInteraction = () => {
      playAudio();
      // Remove listeners once audio is triggered
      events.forEach(e => document.removeEventListener(e, handleInteraction));
    };

    events.forEach(e => document.addEventListener(e, handleInteraction, { once: true }));

    return () => {
      events.forEach(e => document.removeEventListener(e, handleInteraction));
    };
  }, []);

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src="/home.mp3" loop autoPlay />
      
      <div className={styles.imageContainer}>
        <img src="/home.jpg" alt="Home Screen" className={styles.backgroundImage} draggable={false} />
        
        {/* Invisible clickable area positioned over "JOUER" button */}
        <div 
          className={styles.playButtonArea} 
          onClick={onPlay} 
          role="button" 
          aria-label="Jouer au jeu"
          tabIndex={0}
          onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onPlay();
            }
          }}
        />
      </div>
    </div>
  );
}
