import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import styles from './HomeScreen.module.css';

interface HomeScreenProps {
  onPlay: () => void;
}

export function HomeScreen({ onPlay }: HomeScreenProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (hasEntered && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('Audio play failed.', err);
      });
    }
  }, [hasEntered]);

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src="/home.mp3" loop />
      
      <div className={styles.imageContainer}>
        {!hasEntered ? (
          <div 
            className={styles.preScreen} 
            onClick={() => setHasEntered(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setHasEntered(true);
            }}
          >
            <img src="/home.jpg" alt="Background" className={styles.backgroundImageBlurred} draggable={false} />
            <div className={styles.enterOverlay}>
              <button className={styles.enterButton} tabIndex={-1}>Cliquez pour entrer</button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
