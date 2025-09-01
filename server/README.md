# ArbuqConcept Server

Bu dizin, ArbuqConcept e-ticaret platformu için Firebase Functions backend'ini içerir.

## Proje Yapısı

```
server/
├── functions/                 # Firebase Functions
│   ├── src/
│   │   ├── index.ts          # Ana entry point
│   │   ├── routes/           # API route handlers
│   │   │   ├── products.ts   # Ürün işlemleri
│   │   │   ├── auth.ts       # Kimlik doğrulama
│   │   │   ├── orders.ts     # Sipariş işlemleri
│   │   │   └── cart.ts       # Sepet işlemleri
│   │   ├── utils/            # Yardımcı fonksiyonlar
│   │   │   ├── auth.ts       # Kimlik doğrulama yardımcıları
│   │   │   └── validation.ts # Veri doğrulama
│   │   └── types/            # TypeScript tip tanımları
│   │       └── index.ts
│   ├── package.json          # Bağımlılıklar
│   ├── tsconfig.json         # TypeScript konfigürasyonu
│   └── README.md             # Detaylı dokümantasyon
├── firebase.json             # Firebase konfigürasyonu
├── .firebaserc               # Firebase proje ayarları
└── .gitignore                # Git ignore dosyası
```

## Kurulum

1. Firebase CLI'yi yükleyin:
```bash
npm install -g firebase-tools
```

2. Firebase'e giriş yapın:
```bash
firebase login
```

3. Functions dizinine gidin:
```bash
cd functions
```

4. Bağımlılıkları yükleyin:
```bash
npm install
```

## Geliştirme

### Yerel Geliştirme
```bash
cd functions
npm run serve
```

### Build
```bash
cd functions
npm run build
```

### Deploy
```bash
cd functions
npm run deploy
```

## API Endpoints

### Ana Endpoint
- `https://your-region-your-project.cloudfunctions.net/api` - Ana API endpoint

### Alt Endpoints
- `/products` - Ürün işlemleri
- `/auth` - Kimlik doğrulama
- `/orders` - Sipariş işlemleri
- `/cart` - Sepet işlemleri
- `/healthCheck` - Sistem durumu

## Güvenlik

- JWT token tabanlı kimlik doğrulama
- CORS desteği
- Input validation
- Admin yetki kontrolü

## Veritabanı

Firestore kullanılarak aşağıdaki koleksiyonlar yönetilir:
- `products` - Ürün bilgileri
- `users` - Kullanıcı profilleri
- `carts` - Kullanıcı sepetleri
- `orders` - Sipariş bilgileri

## Katkıda Bulunma

1. Feature branch oluşturun
2. Değişikliklerinizi yapın
3. Test edin
4. Pull request oluşturun

## Lisans

MIT License
