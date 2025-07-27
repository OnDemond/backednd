# Руководство по деплою

## 🚀 Платформы для деплоя

### 1. **Vercel** (Рекомендуется для начала)

#### Подготовка:
1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Войдите в аккаунт:
```bash
vercel login
```

#### Деплой:
```bash
vercel
```

#### Переменные окружения в Vercel:
1. Перейдите в Dashboard проекта
2. Settings → Environment Variables
3. Добавьте:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`

---

### 2. **Render**

#### Деплой:
1. Подключите GitHub репозиторий
2. Выберите "Web Service"
3. Настройте:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

#### Переменные окружения:
Добавьте в Environment Variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

---

### 3. **Railway**

#### Деплой:
1. Подключите GitHub репозиторий
2. Railway автоматически определит NestJS
3. Добавьте переменные окружения

#### Переменные окружения:
В разделе Variables добавьте все необходимые переменные.

---

### 4. **Heroku**

#### Подготовка:
1. Установите Heroku CLI
2. Создайте приложение:
```bash
heroku create your-app-name
```

#### Деплой:
```bash
git push heroku main
```

#### Переменные окружения:
```bash
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key
heroku config:set JWT_SECRET=your_secret
heroku config:set JWT_EXPIRES_IN=7d
```

---

### 5. **DigitalOcean App Platform**

#### Деплой:
1. Создайте новый App
2. Подключите GitHub репозиторий
3. Выберите Node.js
4. Настройте переменные окружения

---

## 🔧 Общие настройки

### Переменные окружения для продакшена:
```env
NODE_ENV=production
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
JWT_SECRET=your_very_secure_jwt_secret
JWT_EXPIRES_IN=7d
PORT=3000
```

### Рекомендации по безопасности:
1. **Используйте разные ключи** для разработки и продакшена
2. **Генерируйте безопасный JWT_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
3. **Настройте CORS** для вашего домена
4. **Используйте HTTPS** в продакшене

### Проверка деплоя:
```bash
# Проверка регистрации
curl -X POST https://your-app.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Проверка входа
curl -X POST https://your-app.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📊 Сравнение платформ

| Платформа | Бесплатный план | Простота | Производительность | Рекомендация |
|-----------|----------------|----------|-------------------|--------------|
| Vercel    | ✅             | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐          | 🥇 Лучший выбор |
| Render    | ✅             | ⭐⭐⭐⭐  | ⭐⭐⭐            | 🥈 Хороший выбор |
| Railway   | ❌             | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐          | 🥉 Для серьезных проектов |
| Heroku    | ❌             | ⭐⭐⭐⭐  | ⭐⭐⭐⭐          | 🔧 Для опытных |
| DigitalOcean | ❌         | ⭐⭐⭐    | ⭐⭐⭐⭐⭐        | 🏢 Для предприятий | 