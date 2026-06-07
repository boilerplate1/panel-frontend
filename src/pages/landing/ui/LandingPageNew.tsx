import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './LandingPageNew.module.css';
import { Button } from '@/shared/ui';
import { useSubscriptionPlansQuery } from '@/entities/subscription';
import { PlanGrid, PlanCard } from '@/features/subscription-selection';
import { APP_CONFIG } from '@/shared/config';
import heroImage from '@/shared/assets/hero-image.jpg';
import { LandingFooter } from '@/widgets/LandingFooter';

function LandingPageNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: plans, isLoading } = useSubscriptionPlansQuery();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroSpotlight} />
          <div className="container">
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>{t('landing.hero_title')}</h1>
              <p className={styles.heroDescription}>{t('landing.hero_description')}</p>
              <div className={styles.heroActions}>
                <Button as={Link} to="/register" variant="primary" size="large">
                  {t('landing.try_free')}
                </Button>
                <button
                  className={styles.textLink}
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('landing.view_plans')}
                </button>
              </div>
            </div>
          </div>
          <div className={styles.heroGradient} />
        </section>

        {/* Manifesto Section */}
        <section className={styles.manifestoSection}>
          <div className="container">
            <div className={styles.manifestoHeader}>
              <h2 className={styles.manifestoTitle}>
                {t('landing.manifesto_title')}
                <br />
                <span className={styles.manifestoAccent}>{t('landing.manifesto_accent')}</span>
              </h2>
              <div className={styles.manifestoImageWrapper}>
                <img src={heroImage} alt={t('landing.manifesto_image_alt')} className={styles.manifestoImage} />
              </div>
            </div>
            <div className={styles.manifestoGrid}>
              <div className={styles.manifestoItem}>
                <h4 className={styles.manifestoItemTitle}>{t('landing.manifesto_experience_title')}</h4>
                <p className={styles.manifestoItemDesc}>{t('landing.manifesto_experience_desc')}</p>
              </div>
              <div className={styles.manifestoItem}>
                <h4 className={styles.manifestoItemTitle}>{t('landing.manifesto_standard_title')}</h4>
                <p className={styles.manifestoItemDesc}>{t('landing.manifesto_standard_desc')}</p>
              </div>
              <div className={styles.manifestoItem}>
                <h4 className={styles.manifestoItemTitle}>{t('landing.manifesto_result_title')}</h4>
                <p className={styles.manifestoItemDesc}>{t('landing.manifesto_result_desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className={`${styles.section} ${styles.pricingSection}`} id="pricing">
          <div className="container">
            <h2 className={styles.sectionTitle}>{t('pricing.title')}</h2>
            <PlanGrid isLoading={isLoading}>
              {(plans ?? []).map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onAction={() => navigate('/dashboard/subscription/buy')}
                />
              ))}
            </PlanGrid>
          </div>
        </section>

        <LandingFooter />
      </div>
    </div>
  );
}

export default LandingPageNew;
