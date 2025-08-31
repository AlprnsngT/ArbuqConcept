# Components Structure

Bu klasör, ArbuqConcept uygulamasının tüm React bileşenlerini içerir.

## 📁 Klasör Yapısı

```
src/components/
├── ui/                    # Yeni UI bileşenleri
│   ├── Header.tsx        # Ana sayfa header'ı
│   ├── CompanySlider.tsx # Şirket görselleri slider'ı
│   ├── ProductGrid.tsx   # Ürün grid'i (yeni versiyon)
│   ├── Footer.tsx        # Ana sayfa footer'ı (yeni versiyon)
│   ├── CampaignSlider.tsx # Kampanya ürünleri slider'ı
│   ├── BrandHeader.tsx   # Marka header'ı
│   └── index.ts          # UI bileşenleri export'ları
├── AuthContext.tsx       # Kimlik doğrulama context'i
├── CartContext.tsx       # Sepet yönetimi context'i
├── Providers.tsx         # Context provider'ları
├── ProductCard.tsx       # Ürün kartı bileşeni
├── ProductDetailClient.tsx # Ürün detay sayfası
├── FeaturedCarousel.tsx  # Öne çıkan ürünler carousel'i
├── RatingStars.tsx       # Yıldız rating bileşeni
├── FiltersSidebar.tsx    # Filtreleme sidebar'ı
└── index.ts              # Ana export dosyası
```

## 🎯 Bileşen Kategorileri

### 🆕 Yeni UI Bileşenleri (`/ui/`)
Ana sayfa için özel olarak tasarlanmış modern bileşenler:

- **Header**: Logo, arama çubuğu, kullanıcı menüsü, sepet
- **CompanySlider**: Şirket görselleri için otomatik slider
- **ProductGrid**: Kampanyalı ürünler için grid düzeni
- **Footer**: İletişim bilgileri ve Google Maps mock'u
- **CampaignSlider**: Kampanya ürünleri için slider
- **BrandHeader**: Marka tanıtımı için header

### 🔧 Context ve Provider'lar
Uygulama genelinde state yönetimi:

- **AuthContext**: Kullanıcı kimlik doğrulama
- **CartContext**: Sepet yönetimi
- **Providers**: Tüm context'leri birleştiren wrapper

### 📦 Legacy Bileşenler
Eski sayfalar için kullanılan bileşenler:

- **ProductCard**: Ürün kartı
- **ProductDetailClient**: Ürün detay sayfası
- **FeaturedCarousel**: Öne çıkan ürünler
- **RatingStars**: Yıldız değerlendirme
- **FiltersSidebar**: Filtreleme

## 🚀 Kullanım

### Import Örnekleri

```typescript
// Yeni UI bileşenleri
import { Header, CompanySlider, ProductGrid, Footer } from '../components/ui'

// Context'ler
import { useAuth, useCart } from '../components'

// Legacy bileşenler
import { ProductCard, RatingStars } from '../components'
```

### Context Kullanımı

```typescript
// Auth context
const { user, signInWithEmail, signOut } = useAuth()

// Cart context
const { items, addToCart, removeFromCart } = useCart()
```

## 🔄 Güncellemeler

- ✅ Eski `Navbar.tsx` silindi (Header ile değiştirildi)
- ✅ Eski `Footer.tsx` silindi (yeni Footer ile değiştirildi)
- ✅ Eski `ProductGrid.tsx` silindi (yeni ProductGrid ile değiştirildi)
- ✅ Tüm import'lar temizlendi ve düzenlendi
- ✅ Index dosyaları oluşturuldu

## 📝 Notlar

- Yeni bileşenler modern tasarım ve animasyonlar içerir
- Context'ler TypeScript ile tip güvenliği sağlar
- Legacy bileşenler geriye uyumluluk için korunmuştur
- Tüm bileşenler responsive tasarıma sahiptir
