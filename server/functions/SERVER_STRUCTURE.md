# ArbuqConcept Server Yapısı - Detaylı Açıklama

Bu dokümantasyon, ArbuqConcept e-ticaret platformu için oluşturulan Firebase Functions server yapısını detaylı olarak açıklar.

## 📁 Klasör Yapısı ve İşlevleri

```
server/functions/src/
├── index.ts                 # Ana entry point ve route yönlendirici
├── routes/                  # API endpoint handlers
│   ├── products.ts         # Ürün işlemleri (CRUD, filtreleme)
│   ├── reviews.ts          # Ürün yorumları işlemleri
│   ├── auth.ts             # Kimlik doğrulama işlemleri
│   ├── cart.ts             # Sepet işlemleri
│   └── orders.ts           # Sipariş işlemleri
├── services/               # İş mantığı katmanı
│   ├── products.ts         # Ürün servis katmanı
│   ├── cart.ts            # Sepet servis katmanı
│   ├── auth.ts            # Kimlik doğrulama servis katmanı
│   ├── reviews.ts         # Yorum servis katmanı
│   └── orders.ts          # Sipariş servis katmanı
├── utils/                  # Yardımcı fonksiyonlar
│   ├── auth.ts            # JWT doğrulama yardımcıları
│   └── validation.ts      # Veri doğrulama fonksiyonları
└── types/                 # TypeScript tip tanımları
    └── index.ts           # Tüm tip tanımları
```

## 🏗️ Katmanlı Mimari

### 1. **Routes Katmanı** (`/routes`)
**İşlevi:** HTTP isteklerini karşılar ve uygun service'e yönlendirir.

#### `products.ts` - Ürün Route Handler
- **GET /products** - Tüm ürünleri listele (filtreleme desteği)
- **GET /products/featured** - Öne çıkan ürünleri getir
- **GET /products/campaign** - Kampanyalı ürünleri getir
- **GET /products/:slug** - Slug ile ürün detayı
- **POST /products** - Yeni ürün oluştur (Admin)
- **PUT /products/:id** - Ürün güncelle (Admin)
- **DELETE /products/:id** - Ürün sil (Admin)

#### `reviews.ts` - Yorum Route Handler
- **GET /reviews/product/:productId** - Ürün yorumlarını getir
- **POST /reviews** - Yeni yorum ekle
- **PUT /reviews/:id** - Yorum güncelle
- **DELETE /reviews/:id** - Yorum sil

#### `auth.ts` - Kimlik Doğrulama Route Handler
- **POST /auth/register** - Kullanıcı kaydı
- **POST /auth/login** - Kullanıcı girişi
- **POST /auth/google** - Google ile giriş
- **GET /auth/profile** - Kullanıcı profili
- **PUT /auth/profile** - Profil güncelleme

#### `cart.ts` - Sepet Route Handler
- **GET /cart** - Sepeti görüntüle
- **POST /cart/add** - Sepete ürün ekle
- **PUT /cart/update** - Sepet ürün miktarını güncelle
- **DELETE /cart/remove/:productId** - Sepetten ürün çıkar
- **DELETE /cart/clear** - Sepeti temizle

#### `orders.ts` - Sipariş Route Handler
- **GET /orders** - Kullanıcı siparişlerini listele
- **GET /orders/:id** - Sipariş detayı
- **POST /orders** - Yeni sipariş oluştur
- **PUT /orders/:id/status** - Sipariş durumunu güncelle (Admin)

### 2. **Services Katmanı** (`/services`)
**İşlevi:** İş mantığını içerir, veritabanı işlemlerini yönetir.

#### `products.ts` - Ürün Servis Katmanı
```typescript
class ProductService {
  static async getAllProducts(filters?: ProductFilters): Promise<Product[]>
  static async getFeaturedProducts(limit?: number): Promise<Product[]>
  static async getCampaignProducts(): Promise<Product[]>
  static async getProductBySlug(slug: string): Promise<Product | null>
  static async getProductById(id: string): Promise<Product | null>
  static async createProduct(productData): Promise<string>
  static async updateProduct(id: string, updateData): Promise<void>
  static async deleteProduct(id: string): Promise<void>
  static async updateStock(id: string, quantity: number): Promise<void>
  static async isInStock(id: string, quantity: number): Promise<boolean>
}
```

#### `cart.ts` - Sepet Servis Katmanı
```typescript
class CartService {
  static async getUserCart(userId: string): Promise<Cart>
  static async addToCart(userId: string, productId: string, quantity: number): Promise<void>
  static async updateCartItem(userId: string, productId: string, quantity: number): Promise<void>
  static async removeFromCart(userId: string, productId: string): Promise<void>
  static async clearCart(userId: string): Promise<void>
  static async getCartTotal(userId: string): Promise<number>
  static async getCartItemCount(userId: string): Promise<number>
  static async isCartEmpty(userId: string): Promise<boolean>
}
```

### 3. **Utils Katmanı** (`/utils`)
**İşlevi:** Ortak kullanılan yardımcı fonksiyonlar.

#### `auth.ts` - Kimlik Doğrulama Yardımcıları
- `verifyAuth()` - JWT token doğrulama
- `requireAuth()` - Zorunlu kimlik doğrulama
- `isAdmin()` - Admin yetki kontrolü

#### `validation.ts` - Veri Doğrulama
- `validateEmail()` - Email format kontrolü
- `validatePassword()` - Şifre güvenlik kontrolü
- `validateProduct()` - Ürün veri doğrulama
- `validateOrder()` - Sipariş veri doğrulama
- `validateCartItem()` - Sepet ürün doğrulama
- `sanitizeInput()` - Input temizleme

### 4. **Types Katmanı** (`/types`)
**İşlevi:** TypeScript tip tanımları.

#### Ana Tipler:
- `Product` - Ürün veri yapısı
- `Review` - Yorum veri yapısı
- `User` - Kullanıcı veri yapısı
- `Cart` - Sepet veri yapısı
- `Order` - Sipariş veri yapısı
- `AuthUser` - Kimlik doğrulama kullanıcısı

## 🔄 Veri Akışı

1. **HTTP İsteği** → `index.ts` (Ana router)
2. **Route Handler** → İlgili route dosyası
3. **Service Layer** → İş mantığı ve veritabanı işlemleri
4. **Response** → JSON response döndür

## 🗄️ Veritabanı Koleksiyonları

### `products` Koleksiyonu
```typescript
{
  id: string,
  slug: string,
  name: string,
  description: string,
  price: number,
  stock: number,
  color: 'black' | 'white' | 'amber' | 'clear',
  scented: boolean,
  images: string[],
  avgRating: number,
  reviewCount: number,
  featured: boolean,
  inCampaign: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `users` Koleksiyonu
```typescript
{
  id: string,
  name: string,
  email: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `carts` Koleksiyonu
```typescript
{
  userId: string,
  items: CartItem[],
  total: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `reviews` Koleksiyonu
```typescript
{
  id: string,
  productId: string,
  userId: string,
  rating: number,
  text: string,
  createdAt: string
}
```

### `orders` Koleksiyonu
```typescript
{
  id: string,
  userId: string,
  items: OrderItem[],
  totalAmount: number,
  shippingAddress: ShippingAddress,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'paid' | 'failed',
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🔒 Güvenlik Özellikleri

1. **JWT Token Doğrulama** - Tüm korumalı endpoint'ler
2. **Admin Yetki Kontrolü** - Yönetim işlemleri için
3. **Input Validation** - Tüm giriş verilerinin doğrulanması
4. **CORS Desteği** - Cross-origin istekler için
5. **Rate Limiting** - API kullanım sınırlaması (gelecek)

## 🚀 API Endpoint'leri

### Ana Endpoint
```
https://your-region-your-project.cloudfunctions.net/api
```

### Alt Endpoint'ler
- `/products` - Ürün işlemleri
- `/reviews` - Yorum işlemleri
- `/auth` - Kimlik doğrulama
- `/cart` - Sepet işlemleri
- `/orders` - Sipariş işlemleri
- `/healthCheck` - Sistem durumu

## 📊 Performans Özellikleri

1. **Lazy Loading** - Sadece gerekli verilerin yüklenmesi
2. **Caching** - Sık kullanılan verilerin önbelleklenmesi (gelecek)
3. **Pagination** - Büyük veri setleri için sayfalama (gelecek)
4. **Indexing** - Firestore indeksleri optimize edilmiş

## 🔧 Geliştirme ve Test

### Yerel Geliştirme
```bash
npm run serve
```

### Test
```bash
npm run test
```

### Deploy
```bash
npm run deploy
```

## 📈 Ölçeklenebilirlik

1. **Serverless Architecture** - Otomatik ölçeklendirme
2. **Microservices** - Her fonksiyon bağımsız
3. **Database Optimization** - Firestore performans optimizasyonu
4. **CDN Integration** - Statik dosyalar için CDN (gelecek)

Bu yapı, ArbuqConcept e-ticaret platformunun ihtiyaçlarına uygun olarak tasarlanmış ve gelecekteki genişletmelere hazır bir server altyapısı sağlar.
