# Quick Start Guide

## 1. Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Дождитесь завершения инициализации проекта

## 2. Настройка базы данных

1. В панели управления Supabase перейдите в **SQL Editor**
2. Скопируйте содержимое файла `supabase-migration.sql`
3. Выполните SQL скрипт

## 3. Получение ключей API

1. В панели управления перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL**
   - **anon public** ключ
   - **service_role** ключ (секретный)

## 4. Настройка переменных окружения

1. Скопируйте `env.example` в `.env`
2. Заполните переменные:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_random_secret_key
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=development
   ```

## 5. Запуск приложения

```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm run start:dev
```

## 6. Тестирование API

### Регистрация пользователя
```bash
# Минимальная регистрация
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# С именем и фамилией
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Вход в систему
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Получение профиля (с токеном)
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Структура проекта

```
src/
├── auth/           # Аутентификация
├── users/          # Управление пользователями
├── supabase/       # Интеграция с Supabase
├── config/         # Конфигурация
└── main.ts         # Точка входа
```

## Основные возможности

- ✅ Регистрация и вход пользователей
- ✅ JWT аутентификация
- ✅ Защищенные маршруты
- ✅ CRUD операции с пользователями
- ✅ Интеграция с Supabase Auth
- ✅ Row Level Security (RLS)
- ✅ Валидация данных 