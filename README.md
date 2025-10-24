# Halloween Drawing App

Aplikacja do losowego przypisywania tematów rysunków halloweenowych dla uczestników imprezy.

## Opis

Każdy uczestnik:
1. Wpisuje swoje imię
2. Otrzymuje losowy temat do narysowania (z 12 dostępnych)
3. Otrzymuje osobę z listy, której przekaże rysunek

**Ważne cechy:**
- Każda osoba z listy może być przypisana tylko raz jako odbiorca
- Maksymalnie 17 uczestników może wziąć udział
- **Użytkownik z danym imieniem może wylosować tylko raz** - jeśli spróbuje ponownie (nawet z innego urządzenia), otrzyma to samo przypisanie
- Imiona są normalizowane (wielkość liter i spacje nie mają znaczenia): "Karina", "karina", " Karina " to to samo imię

## Technologie

- **Backend:** Node.js + Express
- **Frontend:** React + Vite
- **Przechowywanie:** In-memory (Map)

## Instalacja i uruchomienie

```bash
npm install
npm run dev
```

Aplikacja uruchomi się na `http://localhost:3000` (frontend + backend w jednym)

## Struktura projektu

```
halloween-drawing-app/
├── src/                       # Frontend React
│   ├── App.jsx               # Routing
│   ├── UserPage.jsx          # Strona dla użytkowników
│   ├── AdminPanel.jsx        # Panel administracyjny
│   ├── App.css               # Style (Halloween theme)
│   └── main.jsx
├── public/                    # Statyczne pliki
├── server.js                  # Express server + Vite integration
├── assignmentService.js       # Logika losowania
├── data.js                    # 12 tematów + 17 uczestników
├── .env                       # Konfiguracja (hasło admin, port)
├── vite.config.js             # Konfiguracja Vite
├── index.html                 # HTML entry point
└── package.json               # Wszystkie zależności
```

## Funkcjonalności

### Strona użytkownika (`/`)
- Wpisanie imienia
- Losowanie tematu i osoby odbiorcy
- Wyświetlenie przypisania

### Panel administracyjny (`/admin`)
- Zabezpieczenie hasłem (domyślnie: `halloween2024`)
- Tabela wszystkich przypisań
- Statystyki (ile osób wzięło udział / maksymalna pojemność)
- Możliwość zresetowania wszystkich przypisań

## API Endpoints

### `POST /api/assign`
Tworzy nowe przypisanie dla użytkownika.

**Request body:**
```json
{
  "userName": "Jan"
}
```

**Response:**
```json
{
  "userName": "Jan",
  "topic": "dynia Halloween",
  "recipient": "Karina",
  "timestamp": "2025-10-24T22:43:54.673Z"
}
```

### `GET /api/status`
Zwraca statystyki aplikacji.

**Response:**
```json
{
  "totalAssignments": 5,
  "availableSlots": 12,
  "maxCapacity": 17
}
```

### `POST /api/admin/assignments`
Zwraca wszystkie przypisania (wymaga hasła administratora).

**Request body:**
```json
{
  "password": "halloween2024"
}
```

### `POST /api/admin/reset`
Resetuje wszystkie przypisania (wymaga hasła administratora).

**Request body:**
```json
{
  "password": "halloween2024"
}
```

## Konfiguracja

Plik `.env` w głównym katalogu:
```
PORT=3000
ADMIN_PASSWORD=halloween2024
```

Możesz zmienić hasło administratora i port serwera.

## Lista tematów

1. dynia Halloween
2. oko
3. duch
4. mroczny księżyc
5. nietoperz
6. pajęczyna
7. czarny kot
8. mglista noc
9. krwawy zachód słońca
10. stara latarnia
11. nawiedzony dom
12. potworna filiżanka kawy

## Lista uczestników (odbiorcy rysunków)

Karina, Mateusz, Natalia, Marcin, Domi, Marek, Julia, Marek od Juli, Martyna Liskowa, Bartosz, Martyna Misiowa, Adrian, Ola, Daga, Artur, Ula, Patryk

## Deployment

### Krok 1: Deploy Backend (Render/Railway/Heroku)

**Opcja A: Render**
1. Utwórz konto na [render.com](https://render.com)
2. Połącz repozytorium GitHub
3. Utwórz nowy "Web Service"
4. Ustaw:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Dodaj zmienne środowiskowe:
   - `PORT`: 3000 (lub pozostaw puste - Render ustawi automatycznie)
   - `ADMIN_PASSWORD`: twoje-hasło-admin
6. Deploy - otrzymasz URL typu: `https://twoja-aplikacja.onrender.com`

**Opcja B: Railway**
1. Utwórz konto na [railway.app](https://railway.app)
2. Połącz repozytorium GitHub
3. Ustaw root directory na `backend`
4. Dodaj zmienne środowiskowe jak wyżej
5. Deploy - otrzymasz URL backendu

### Krok 2: Deploy Frontend (Vercel/Netlify)

**Opcja A: Vercel**
1. Utwórz konto na [vercel.com](https://vercel.com)
2. Import repozytorium GitHub
3. Ustaw:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Dodaj zmienną środowiskową:
   - `VITE_API_URL`: URL twojego backendu (np. `https://twoja-aplikacja.onrender.com`)
5. Deploy

**Opcja B: Netlify**
1. Utwórz konto na [netlify.com](https://netlify.com)
2. Import repozytorium GitHub
3. Ustaw base directory na `frontend`
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Dodaj zmienną środowiskową `VITE_API_URL`

### Ważne uwagi dotyczące deployment:
- Backend musi być uruchomiony przed frontendem
- CORS jest już skonfigurowany w backendie (akceptuje wszystkie origins)
- Przypisania są przechowywane **tylko w pamięci** - restart backendu wyczyści wszystkie dane
- Dla trwałego przechowywania rozważ dodanie bazy danych (np. PostgreSQL na Render)

## Uwagi

- Przypisania są przechowywane **tylko w pamięci serwera**
- Po restarcie serwera wszystkie przypisania zostaną utracone
- Jeśli potrzebujesz trwałego przechowywania, rozważ dodanie SQLite lub PostgreSQL
