# Hypex Web Frontend

Личный кабинет Hypex VPN. Фронтенд отвечает за авторизацию, профиль, устройства,
покупку подписки, статусы платежей, историю платежей, локализацию, тему и PWA.

## Стек

- React 19 + React Router
- Vite + TypeScript
- TanStack Query for server state
- Zustand for local UI/auth/payment state
- Axios API client with access-token refresh
- i18next for `ru`/`en` localization
- CSS Modules
- Vite PWA

## Требования

- Node.js `>=23`
- npm

## Переменные окружения

Скопируй `.env.example` и заполни значения:

```env
VITE_API_URL=https://api.example.com
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
VITE_ANDROID_APK_URL=https://example.com/app.apk
VITE_BASE_URL=https://my.hypexvpn.com
```

В Docker значения могут переопределяться через `/env.js`, который генерируется
скриптом `docker-entrypoint.d/40-runtime-env.sh`.

## Команды

```bash
npm install
npm run dev
npm run build
npm run lint
npm run format
npm run preview
```

## Архитектура проекта

Фронтенд пишется слоями:

```text
src/
  app/       приложение: router, layouts, providers, guards
  pages/     route-level страницы, которые собирают features/widgets/shared
  widgets/   крупные layout-блоки, используемые на разных страницах
  features/  бизнес-фичи: auth, profile, devices, payments
  shared/    переиспользуемая база: ui, api, lib, config, styles
  stores/    глобальное client-state состояние Zustand
```

### `app`

В `app` лежит только инфраструктура приложения:

- `router.tsx` - маршруты. Он lazy-load'ит `pages`, а не файлы глубоко из `features`.
- `layouts/` - layout-компоненты.
- `providers/` - глобальные провайдеры.
- `guards/` - route guards.

В `app` не пишем бизнес-логику конкретной фичи.

### `pages`

`pages` - это слой сборки экранов под роуты.

Правильно:

```tsx
import { ProfilePage as ProfileFeaturePage } from '@/features/profile';

export default function ProfilePage() {
  return <ProfileFeaturePage />;
}
```

Неправильно:

```ts
export { default } from '@/features/profile/ui/ProfilePage';
```

Page должен быть явным компонентом. Даже если сейчас он просто возвращает одну
feature, потом туда можно спокойно добавить widgets, SEO, guards или page-level
composition.

### `features`

Каждая feature держит свой код внутри себя:

```text
features/payment-flow/
  index.ts
  ui/
  model/
  lib/
```

Назначение папок:

- `ui/` - React-компоненты, модалки, шаги, CSS modules.
- `model/` - hooks со сценарием фичи: route params, React Query, stores, handlers.
- `lib/` - чистые функции без React.
- `index.ts` - публичный UI API фичи.

Feature не должна импортировать другую feature. Если код нужен двум фичам, он
должен быть в `shared`.

Неправильно:

```ts
import { getDeviceIcon } from '@/features/device-management/...';
```

Правильно:

```ts
import { getDeviceIcon } from '@/shared/lib';
```

### `shared/api`

`shared/api` - низкоуровневый слой API:

- `api-client.ts` - axios client и refresh token.
- `services/` - функции запросов к backend.
- `hooks/` - React Query hooks поверх services.
- `generated/` - DTO/types ответа backend.

`shared/api/hooks` нужен, но только для server-state:

```ts
useDevicesQuery()
useSubscriptionPlansQuery()
useCreatePaymentIntentMutation()
```

Туда нельзя класть сценарии UI, переходы роутера, toast, local state модалок.
Это относится к `features/*/model`.

### `stores`

`stores` - глобальное client-state состояние:

- auth session
- payment draft/current payment
- UI state: toast/sidebar

Store можно использовать в `app`, `widgets`, `pages`, `features/model`.
Не импортировать stores из `shared`.

### `shared/ui`

Только переиспользуемые UI-компоненты без бизнес-сценариев:

- `Button`
- `Card`
- `Modal`
- `Pagination`
- `TurnstileWidget`

Если компонент знает про конкретную бизнес-фичу, ему не место в `shared/ui`.

## Правила написания кода

- Не создавать пустые папки `components`, `modals`, `model`, `lib`, `hooks`.
- Не делать папку "на будущее".
- Если в feature есть orchestration/state, выноси это в `model/useFeatureName.ts`.
- Если логика чистая и не зависит от React, выноси в `lib/*.ts`.
- UI-компонент должен в основном читать props/hook result и рендерить JSX.
- Не проверять route через `location.pathname.includes(...)` или `endsWith(...)`.
  Используй route params, `useMatch`, константы маршрутов или явный state.
- Не импортировать deep files другой feature.
- Не реэкспортить stores/api hooks из `features/index.ts`.
- Не оставлять fallback-тексты в mojibake или случайной кодировке.
- Для общих хелперов использовать `shared/lib`.
- Для общих visual components использовать `shared/ui`.
- Для backend-запросов использовать `shared/api/services`.
- Для React Query использовать `shared/api/hooks`.
- Для page composition использовать `pages`.

## Как писать код в этом проекте

### Feature page

Feature page должна быть тонкой. Она получает данные из `model` hook и рендерит
UI.

Правильно:

```tsx
import { useProfilePage } from '../model/useProfilePage';

function ProfilePage() {
  const profile = useProfilePage();

  if (!profile.user) return null;

  return <ProfileView user={profile.user} />;
}
```

Неправильно:

```tsx
function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data } = useDevicesQuery(!!user);
  const { showToast } = useUIStore();

  // 150 строк запросов, роутинга, toast, расчетов и JSX в одном файле
}
```

### Feature model

`model` - место для сценария фичи.

Туда можно класть:

- React Query hooks.
- Zustand stores.
- `useNavigate`, `useParams`, `useSearchParams`.
- handlers: `save`, `cancel`, `select`, `submit`.
- derived state для UI.

Пример:

```ts
export function useDevicesPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const devicesQuery = useDevicesQuery(!!user, page);

  return {
    user,
    page,
    setPage,
    devices: devicesQuery.data?.items ?? [],
    isLoading: devicesQuery.isLoading,
  };
}
```

### Feature lib

`lib` - только чистая логика без React.

Правильно:

```ts
export function getBestValuePlanId(plans?: SubscriptionPlanResponse[]) {
  return plans?.reduce(...).id ?? null;
}
```

Неправильно:

```ts
export function useBestValuePlan() {
  const { data } = useSubscriptionPlansQuery();
  return data?.reduce(...);
}
```

Это уже `model`, потому что используется React hook.

### Shared API

`shared/api/services` - только HTTP-запросы.

```ts
export const devicesService = {
  getAll: (page: number) => apiClient.get(...).then((r) => r.data),
};
```

`shared/api/hooks` - только React Query обертки над services.

```ts
export function useDevicesQuery(enabled: boolean, page = 1) {
  return useQuery({
    queryKey: deviceKeys.page(page),
    queryFn: () => devicesService.getAll(page),
    enabled,
  });
}
```

Нельзя класть в `shared/api/hooks`:

- `navigate(...)`
- `showToast(...)`
- open/close modal state
- feature-specific сценарии
- сохранение UI state

Это должно быть в `features/*/model`.

### Imports

Правильно:

```ts
import { Button } from '@/shared/ui';
import { useDevicesQuery } from '@/shared/api';
import { useAuth } from '@/stores/authStore';
import { getDeviceIcon } from '@/shared/lib';
```

Неправильно:

```ts
import { Something } from '@/features/other-feature';
import { getDeviceIcon } from '@/features/device-management/ui/pages/DevicePage.utils';
import { useUIStore } from '@/shared/lib';
```

### Pages

Page - это route entrypoint. Он собирает экран из публичного API features.

Правильно:

```tsx
import { DevicesPage as DevicesFeaturePage } from '@/features/device-management';

export default function DevicesPage() {
  return <DevicesFeaturePage />;
}
```

Неправильно:

```ts
export { default } from '@/features/device-management/ui/pages/DevicesPage';
```

### Router

Router грузит только pages.

Правильно:

```ts
const DevicesPage = lazy(() => import('@/pages/devices/DevicesPage'));
```

Неправильно:

```ts
const DevicesPage = lazy(() => import('@/features/device-management/ui/pages/DevicesPage'));
```

### Routes

Не проверять роуты строковыми `includes` / `endsWith`.

Неправильно:

```ts
if (location.pathname.endsWith('/provider')) {}
if (location.pathname.includes('/method/')) {}
```

Правильно:

```ts
const step = params.provider ? 'method' : routePlanId ? 'provider' : 'plans';
```

или:

```ts
const failedMatch = useMatch(ROUTES.PAYMENT_FAILED);
```

### Папки

Папка должна существовать только если в ней есть реальные файлы.

Неправильно:

```text
features/profile/ui/components/  # пусто
features/payment-flow/ui/modals/ # пусто
```

Правильно:

```text
features/profile/
  index.ts
  model/
  ui/
```

### Тексты и локализация

- Пользовательские тексты брать из i18n.
- Не оставлять mojibake fallback вроде `РџСЂРѕРґР»РёС‚СЊ`.
- Если текст нужен в UI, добавить ключ в `shared/lib/locales/ru.ts` и `en.ts`.

### Когда добавлять новый слой

Добавлять `model` только если есть state/orchestration.

Добавлять `lib` только если есть чистые функции.

Не добавлять папки заранее.

## Маршруты

- `/login` and `/register`
- `/dashboard`
- `/dashboard/devices`
- `/dashboard/history`
- `/dashboard/history/:id`
- `/dashboard/checkout`
- `/dashboard/checkout/:planId/provider`
- `/dashboard/checkout/:planId/provider/:provider`
- `/dashboard/checkout/status/:intentId`
- `/payment/success`
- `/payment/failed`

Checkout flow:

1. User selects a plan on `/dashboard/checkout`.
2. The app moves the user to `/dashboard/checkout/:planId/provider`.
3. If the provider has internal methods, the app moves to `/dashboard/checkout/:planId/provider/:provider`.
4. The app creates a payment intent and moves the user to `/dashboard/checkout/status/:intentId`.
5. The status page polls the intent, lets the user open the provider invoice, cancel, or manually re-check the status.
6. Payment providers return users to the public payment result URLs:

```text
https://my.hypexvpn.com/payment/success?intentId=<payment-intent-id>
https://my.hypexvpn.com/payment/failed?intentId=<payment-intent-id>
```

The page also accepts `paymentId` or `id` as query parameter names. If the user is still authenticated, the page checks the latest intent status and refreshes subscription/history queries after success. If the session is gone, it still shows a safe static result and offers login.

## Quality Gates

Before deploy:

```bash
npm run build
npm run lint
npm audit --omit=dev
```

## Deployment Notes

Vercel routing and cache headers are configured in `vercel.json`. Container deployment uses `Dockerfile`, `nginx.container.conf`, and `docker-entrypoint.d/40-runtime-env.sh`.

For sub-path deployments, update both `vite.config.cjs` `base` and router `basename`.
