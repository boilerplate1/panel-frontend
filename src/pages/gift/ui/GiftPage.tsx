import { useNavigate, useParams } from 'react-router-dom';
import styles from './GiftPage.module.css';
import { Logo } from '@/shared/ui';
import { RunawayTemplate, SummerTemplate } from '@/features/gift-reveal';

function GiftPage() {
  const navigate = useNavigate();
  const { template = 'runaway' } = useParams();

  const renderTemplate = () => {
    switch (template) {
      case 'summer':
        return <SummerTemplate />;
      case 'runaway':
      default:
        return <RunawayTemplate />;
    }
  };

  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <Logo />
        </div>
      </header>

      {renderTemplate()}
    </main>
  );
}

export default GiftPage;
