import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/shared/ui';
import { 
  UserPlus, 
  CreditCard, 
  Zap, 
  MonitorSmartphone, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  BookOpen, 
  Menu, 
  X 
} from 'lucide-react';
import styles from './WikiPage.module.css';

const WikiPage: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState('getting-started');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = useMemo(() => [
    {
      group: 'Основы',
      items: [
        {
          id: 'getting-started',
          icon: <UserPlus size={18} />,
          label: 'Начало работы',
          title: 'Создание аккаунта и бонусы',
          content: (
            <>
              <p>Добро пожаловать в <strong>Hypex VPN</strong>. Наш сервис создан для обеспечения максимальной приватности без лишних сложностей.</p>
              
              <h3>📝 Регистрация</h3>
              <p>Для создания аккаунта вам понадобится только логин и пароль. Мы не требуем подтверждения почты или номера телефона для базового доступа.</p>
              <ul>
                <li>Скачайте и установите приложение для вашей платформы.</li>
                <li>Нажмите кнопку <strong>"Регистрация"</strong>.</li>
                <li>Введите логин и пароль. Сохраните их в надежном месте.</li>
              </ul>

              <div className={styles.callout}>
                <Zap size={20} className={styles.calloutIcon} />
                <div>
                  <strong>Бонус при регистрации:</strong> Каждый новый пользователь получает 7 дней Premium-доступа и 50 ГБ трафика автоматически.
                </div>
              </div>

              <h3>🛡️ Безопасность аккаунта</h3>
              <p>Ваш аккаунт привязан к уникальному ключу устройства. Для входа на других девайсах используйте QR-код в разделе "Устройства".</p>
            </>
          )
        },
        {
          id: 'subscription',
          icon: <CreditCard size={18} />,
          label: 'Подписка и оплата',
          title: 'Как продлить доступ',
          content: (
            <>
              <p>После окончания триального периода (7 дней), вам потребуется активная подписка для продолжения использования VPN.</p>
              
              <h3>💳 Способы оплаты</h3>
              <p>Мы поддерживаем все популярные методы оплаты, включая:</p>
              <ul>
                <li>Российские банковские карты (МИР, Visa, Mastercard)</li>
                <li>Система быстрых платежей (СБП)</li>
                <li>Криптовалюты (USDT, BTC, TON)</li>
              </ul>

              <h3>🔄 Процесс активации</h3>
              <ol>
                <li>Перейдите в Личный кабинет на сайте.</li>
                <li>Выберите нужный период подписки.</li>
                <li>После завершения транзакции откройте мобильное приложение.</li>
                <li>В разделе <strong>Профиль</strong> нажмите кнопку обновления статуса.</li>
              </ol>

              <div className={styles.calloutInfo}>
                <BookOpen size={20} className={styles.calloutIcon} />
                <div>
                  <strong>Важно:</strong> Прямая оплата внутри приложения через Google Play недоступна. Все расчеты производятся на сайте.
                </div>
              </div>
            </>
          )
        }
      ]
    },
    {
      group: 'Техническая часть',
      items: [
        {
          id: 'connection',
          icon: <Zap size={18} />,
          label: 'Подключение',
          title: 'Настройка и запуск VPN',
          content: (
            <>
              <p>Hypex использует современные протоколы шифрования, обеспечивая обход блокировок и высокую скорость.</p>
              
              <h3>⚡ Быстрый старт</h3>
              <p>На главном экране нажмите центральную кнопку. Система автоматически подберет оптимальный сервер на основе вашего местоположения.</p>

              <h3>🔗 Что такое Маршрутизация?</h3>
              <p>Это одна из самых полезных функций Hypex. Она позволяет вам выбирать, какие приложения на вашем телефоне будут работать через VPN, а какие — через обычный интернет.</p>
              <ul>
                <li><strong>Только выбранные:</strong> VPN будет работать только для тех приложений, которые вы отметите галочкой (например, браузер или Instagram).</li>
                <li><strong>Все, кроме выбранных:</strong> VPN будет работать для всего телефона, кроме отмеченных приложений (удобно для банковских сервисов или такси).</li>
              </ul>

              <h3>🔧 Режимы работы (UDP/TCP)</h3>
              <p>В настройках соединения вы можете переключать сетевой стек:</p>
              <ul>
                <li><strong>UDP:</strong> Рекомендуется для игр и видеосвязи. Минимальная задержка.</li>
                <li><strong>TCP:</strong> Более стабильное соединение в нестабильных сетях.</li>
              </ul>
            </>
          )
        },
        {
          id: 'multi-device',
          icon: <MonitorSmartphone size={18} />,
          label: 'Мульти-девайс',
          title: 'Управление устройствами',
          content: (
            <>
              <p>Одна подписка Hypex позволяет подключать до 5 устройств одновременно.</p>
              
              <h3>📲 Как добавить Android TV или ПК</h3>
              <ol>
                <li>Откройте Hypex на телефоне и перейдите в <strong>Устройства</strong>.</li>
                <li>Нажмите иконку <strong>"+"</strong> для запуска сканера.</li>
                <li>На целевом устройстве откройте экран входа и выберите "Вход по QR".</li>
                <li>Отсканируйте код — устройство будет привязано мгновенно.</li>
              </ol>

              <div className={styles.callout}>
                <MonitorSmartphone size={20} className={styles.calloutIcon} />
                <div>
                  <strong>Совет:</strong> Используйте QR-код для быстрого входа на телевизорах, чтобы не вводить пароль с пульта.
                </div>
              </div>
            </>
          )
        }
      ]
    }
  ], []);

  const allItems = useMemo(() => sections.flatMap(s => s.items), [sections]);
  const activeItem = useMemo(() => allItems.find(i => i.id === activeTabId) || allItems[0], [activeTabId, allItems]);
  const activeIndex = allItems.findIndex(i => i.id === activeTabId);

  const handleNext = () => {
    if (activeIndex < allItems.length - 1) {
      setActiveTabId(allItems[activeIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveTabId(allItems[activeIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTabId]);

  return (
    <div className={styles.nextraRoot}>
      {/* Mobile Header */}
      <div className={styles.mobileNav}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={styles.menuToggle}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link to="/" className={styles.mobileBrand}>HYPEX WIKI</Link>
      </div>

      <PageContainer className={styles.container}>
        <div className={styles.layout}>
          {/* Nextra Sidebar */}
          <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input type="text" placeholder="Поиск по документации..." disabled />
            </div>

            <nav className={styles.nav}>
              {sections.map((section, idx) => (
                <div key={idx} className={styles.navGroup}>
                  <h4 className={styles.groupTitle}>{section.group}</h4>
                  {section.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTabId(item.id)}
                      className={`${styles.navLink} ${activeTabId === item.id ? styles.navLinkActive : ''}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className={styles.main}>
            <div className={styles.breadcrumbs}>
              <span>Документация</span>
              <ChevronRight size={14} />
              <span className={styles.currentBreadcrumb}>{activeItem.label}</span>
            </div>

            <article className={styles.article}>
              <h1 className={styles.pageTitle}>{activeItem.title}</h1>
              <div className={styles.prose}>
                {activeItem.content}
              </div>
            </article>

            {/* Pagination Controls */}
            <div className={styles.pagination}>
              <button 
                onClick={handlePrev} 
                className={`${styles.pagerBtn} ${activeIndex === 0 ? styles.pagerBtnHidden : ''}`}
              >
                <div className={styles.pagerLabel}>Назад</div>
                <div className={styles.pagerTitle}>
                  <ChevronLeft size={18} /> {activeIndex > 0 ? allItems[activeIndex-1].label : ''}
                </div>
              </button>

              <button 
                onClick={handleNext} 
                className={`${styles.pagerBtn} ${styles.pagerBtnNext} ${activeIndex === allItems.length - 1 ? styles.pagerBtnHidden : ''}`}
              >
                <div className={styles.pagerLabel}>Далее</div>
                <div className={styles.pagerTitle}>
                  {activeIndex < allItems.length - 1 ? allItems[activeIndex+1].label : ''} <ChevronRight size={18} />
                </div>
              </button>
            </div>
          </main>
        </div>
      </PageContainer>
    </div>
  );
};

export default WikiPage;
