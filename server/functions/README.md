# ArbuqConcept Firebase Functions

Bu Firebase Functions projesi, ArbuqConcept e-ticaret platformu için backend API'sini sağlar.

## Özellikler

- **Ürün Yönetimi**: Ürün CRUD işlemleri
- **Kullanıcı Kimlik Doğrulama**: Kayıt, giriş ve profil yönetimi
- **Sepet İşlemleri**: Sepet ekleme, güncelleme ve temizleme
- **Sipariş Yönetimi**: Sipariş oluşturma ve takip

## API Endpoints

### Ürünler (`/products`)
- `GET /products` - Tüm ürünleri listele
- `GET /products/:id` - Tek ürün detayı
- `POST /products` - Yeni ürün oluştur (Admin)
- `PUT /products/:id` - Ürün güncelle (Admin)
- `DELETE /products/:id` - Ürün sil (Admin)

### Kimlik Doğrulama (`/auth`)
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi
- `GET /auth/profile` - Kullanıcı profili
- `PUT /auth/profile` - Profil güncelleme

### Sepet (`/cart`)
- `GET /cart` - Sepeti görüntüle
- `POST /cart/add` - Sepete ürün ekle
- `PUT /cart/update` - Sepet ürün miktarını güncelle
- `DELETE /cart/clear` - Sepeti temizle

### Siparişler (`/orders`)
- `GET /orders` - Kullanıcı siparişlerini listele
- `GET /orders/:id` - Sipariş detayı
- `POST /orders` - Yeni sipariş oluştur
- `PUT /orders/:id/status` - Sipariş durumunu güncelle (Admin)

### Sistem
- `GET /healthCheck` - Sistem durumu kontrolü

## Kurulum

1. Firebase CLI'yi yükleyin:
```bash
npm install -g firebase-tools
```

2. Firebase'e giriş yapın:
```bash
firebase login
```

3. Projeyi başlatın:
```bash
firebase init
```

4. Bağımlılıkları yükleyin:
```bash
cd functions
npm install
```

## Geliştirme

### Yerel Geliştirme
```bash
npm run serve
```

### Build
```bash
npm run build
```

### Deploy
```bash
npm run deploy
```

## Ortam Değişkenleri

Firebase Functions için gerekli ortam değişkenleri:

- `GOOGLE_APPLICATION_CREDENTIALS`: Firebase Admin SDK kimlik bilgileri
- `FIREBASE_PROJECT_ID`: Firebase proje ID'si

## Güvenlik

- Tüm endpoint'ler JWT token doğrulaması gerektirir (health check hariç)
- Admin işlemleri için özel yetki kontrolü
- Input validation ve sanitization
- CORS desteği

## Veritabanı Yapısı

### Collections

- `products`: Ürün bilgileri
- `users`: Kullanıcı profilleri
- `carts`: Kullanıcı sepetleri
- `orders`: Sipariş bilgileri

## Hata Kodları

- `200`: Başarılı
- `201`: Oluşturuldu
- `400`: Geçersiz istek
- `401`: Kimlik doğrulama gerekli
- `403`: Erişim reddedildi
- `404`: Bulunamadı
- `500`: Sunucu hatası

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
