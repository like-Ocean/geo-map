
# Hexagon Spatial Analysis Tool

**Интерактивное приложение** для пространственного анализа с помощью шестиугольной сетки.

-   React + TypeScript
    
-   Deck.GL + MapLibre GL
    
-   Turf.js (hexGrid, centerOfMass, distance)
    
-   Zustand
    
-   Ant Design
    
-   React Query (TanStack Query)
    

----------

## Содержание

1.  [Возможности](#возможности)
    
2.  [Требования](#требования)
    
3.  [Запуск без Docker](#запуск-без-docker)
    
    1.  [Установка Node.js и Yarn](#установка-node.js-и-yarn)
        
    2.  [Клонирование репозитория](#клонирование-репозитория)
        
    3.  [Установка зависимостей](#установка-зависимостей)
        
    4.  [Запуск в режиме разработки](#запуск-в-режиме-разработки)
        
4.  [Запуск через Docker](#запуск-через-docker)
    
    1.  [Установка Docker](#установка-docker)
        
    2.  [Сборка и запуск контейнера](#сборка-и-запуск-контейнера)
        
5.  [Структура проекта](#структура-проекта)
    
6.  [Ключевые моменты работы](#ключевые-моменты-работы)
    

----------

## Возможности

-   Поиск и выбор области по OSM Nominatim API
    
-   Отрисовка границ выбранной области
    
-   Генерация шестиугольной сетки поверх области
    
-   Ввод пользовательских значений для каждой ячейки
    
-   Расчет "поля напряженности" на основе удаленности
    

----------

## Требования

### Запуск без Docker

-   **Node.js** версии ≥ 18.x (скачать: [https://nodejs.org](https://nodejs.org/))
    
-   **Yarn** или **npm** (npm идет в комплекте с Node.js)
    
-   Интернет для запросов к Nominatim и тайлов карт
    

### Запуск через Docker

-   **Docker Engine** (скачать: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/))
    
-   (опционально) **Docker Compose**
    

> Если у вас нет Node.js, используйте Docker. Если нет Docker — установите Node.js.

----------

## Запуск без Docker

### Установка Node.js и Yarn

1.  Скачайте установщик с [https://nodejs.org](https://nodejs.org/) и установите LTS-версию (≥18)
    
2.  (Опционально) Установите Yarn глобально:
    
    ```bash
    npm install -g yarn
    
    ```
    

### Клонирование репозитория

```bash
git clone https://github.com/your-org/geo-map.git
cd geo-map

```

### Установка зависимостей

```bash
yarn install
```

### Запуск в режиме разработки

```bash
yarn dev
```

-   Откройте в браузере: [http://localhost:5173](http://localhost:5173/)
    
-   При изменении кода страница обновится автоматически
    

### Сборка и просмотр production-билда

```bash
yarn build
```

```bash
yarn preview
```

-   Production-статические файлы в папке `dist`
    
-   Сервер предпросмотра откроется на [http://localhost:4173](http://localhost:4173/)
    

----------

## Запуск через Docker

### Установка Docker

-   Установите Docker Desktop (Windows/macOS) или Docker Engine (Linux):  
    [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
    

### Сборка и запуск контейнера

1.  В корне проекта (где находится `Dockerfile`):
    
    ```bash
    docker-compose build
    
    ```
    
2.  Запустите контейнер:
    
    ```bash
    docker-compose up -d
    
    ```
    
3.  Перейдите в браузере: [http://localhost:4173](http://localhost:4173/)
    

> Для остановки выполните:
> 
> ```bash
> 
> docker-compose down
> 
> ```

----------

## Структура проекта

```
geo-map/
├─ src/
│  ├─ api/             # React Query hooks и клиенты для OSM Nominatim
│  ├─ components/      # Компоненты React
│  │   ├─ common/      # Map, Search, DeckOverlay
│  │   └─ features/    # HexagonInputModal и др.
│  ├─ constants/       # MapTiler стили, пути API
│  ├─ helpers/         # Утилиты (createSelectors, debounce и др.)
│  ├─ store/           # Zustand-сторы (location, hexagon)
│  ├─ types/           # TypeScript-описания (GeoJSON, HexagonFeature)
│  ├─ utils/           # hex-geometry.ts, tension-calculator.ts
│  ├─ app.tsx          # Корневой компонент
│  └─ index.tsx        # Точка входа
├─ Dockerfile          # Инструкция для Docker
├─ docker-compose.yml  # (опционально) dev-сервис
├─ package.json        # Скрипты и зависимости
├─ yarn.lock / package-lock.json
└─ tsconfig.json       # Конфигурация TypeScript

```

----------

## Ключевые моменты работы

1.  **Поиск локации** (`SearchLocation`):
    
    -   Debounce пользовательского ввода
        
    -   React Query запрос `/search` к Nominatim
        
    -   Сохранение полной OSMLocation в Zustand
        
2.  **Загрузка GeoJSON** (`useGetLocationQuery`):
    
    -   Получение границ выбранной области
        
    -   Центрирование карты под эти границы
        
3.  **Генерация сетки** (`hexGrid` из Turf.js):
    
    -   Плоские шестиугольники в odd-q вертикальной раскладке
        
    -   Привязка к границе (mask)
        
    -   Сохранение в HexagonFeature (id, value, cellSize)
        
4.  **Ввод значений** (`HexagonInputModal`):
    
    -   Открытие по клику на шестиугольник
        
    -   Сохранение значения и source → recalculateTension()
        
5.  **Расчет напряженности** (`calculateTension`):
    
    -   `centerOfMass` → центр каждой ячейки
        
    -   `distance` → расстояние в км
        
    -   Круги соседей: n = ceil(distKm / cellSize)
        
    -   Формула: value += srcValue / n²
        

----------