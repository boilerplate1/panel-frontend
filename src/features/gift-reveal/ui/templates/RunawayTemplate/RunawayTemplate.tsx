import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import styles from './RunawayTemplate.module.css';

type Phase = 'idle' | 'waiting' | 'reveal';

const BUTTON_TRIGGER = 26;
const TEXT_TRIGGER = 29;
const AUDIO_START = 24;

export const RunawayTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const showActionsRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [showActions, setShowActions] = useState(false);
  const [textCount, setTextCount] = useState(0);

  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const initAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaElementSource(audio);

    analyser.fftSize = 128;
    source.connect(analyser);
    analyser.connect(ctx.destination);

    const data = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      analyser.getByteFrequencyData(data);
      const bass = data.slice(0, 2).reduce((a, b) => a + b, 0) / 510;

      if (pageRef.current) {
        pageRef.current.style.setProperty('--bass', bass.toFixed(3));
      }

      const currentTime = audio.currentTime;

      if (currentTime >= BUTTON_TRIGGER && !showActionsRef.current) {
        showActionsRef.current = true;
        setShowActions(true);
      }

      if (currentTime >= TEXT_TRIGGER) {
        const secondsSinceTrigger = Math.floor(currentTime - TEXT_TRIGGER);
        const targetCount = Math.min(10, 1 + secondsSinceTrigger);
        setTextCount(targetCount);
      }

      if (currentTime > AUDIO_START + 24 && bass > 0.75 && phaseRef.current !== 'reveal') {
        setPhase('reveal');
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const handleStart = () => {
    if (phase !== 'idle') return;
    setPhase('waiting');
    if (audioRef.current) {
      audioRef.current.currentTime = AUDIO_START;
      audioRef.current.play();
    }
    void initAudio();
  };

  return (
    <section
      ref={pageRef}
      className={`${styles.root} ${phase !== 'idle' ? styles.active : ''}`}
      onClick={handleStart}
    >
      <audio ref={audioRef} src="/runaway.mp3" preload="auto" />

      <div className={styles.typoOverlay}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`${styles.typoLine} ${i < textCount ? styles.typoLineActive : ''}`}
          >
            {t('gift.brighter_segment')}
          </div>
        ))}
      </div>

      <div className={`${styles.rewardBlock} ${showActions ? styles.rewardVisible : ''}`}>
        <div className={styles.visualStack}>
          {phase === 'idle' && <div className={styles.introText}>{t('gift.intro_label')}</div>}
          <img src="/icons/gift.png" alt="" className={styles.giftIcon} />
          {phase === 'idle' && <div className={styles.instruction}>{t('gift.tap_hint')}</div>}
        </div>

        <div className={styles.rewardContent}>
          <div className={styles.rewardInfo}>
            <div className={styles.rewardLabel}>{t('gift.top_title')}</div>
            <h1 className={styles.rewardTitle}>{t('gift.claim_days')}</h1>
            <p className={styles.rewardSubLabel}>{t('gift.free_premium')}</p>
          </div>

          <div className={styles.rewardActions}>
            <Button
              variant="primary"
              className={styles.mainBtn}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {t('gift.claim_button')}
            </Button>
            <Button
              variant="secondary"
              className={styles.sideBtn}
              onClick={(e) => {
                e.stopPropagation();
                navigate('/');
              }}
            >
              {t('gift.back_to_home')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
