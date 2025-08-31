# Components Directory Structure

Bu dizin, uygulamanın tüm React bileşenlerini organize eder.

## 📁 **Klasör Yapısı**

### **🏠 `/homepage` - Ana Sayfa Bileşenleri**
- `CompanySlider.tsx` - Şirket görselleri için otomatik slider
- `BrandHeader.tsx` - Marka adı ve logo bileşeni
- `CampaignSlider.tsx` - Kampanya ürünleri için slider

### **🏗️ `/layout` - Sayfa Düzeni Bileşenleri**
- `Header.tsx` - Üst navigasyon çubuğu (logo, arama, kullanıcı, sepet)
- `Footer.tsx` - Alt bilgi çubuğu (iletişim, harita, sosyal medya)

### **🛍️ `/products` - Ürün Sayfası Bileşenleri**
- `ProductGrid.tsx` - Ürün grid görünümü ve sıralama seçenekleri
- `FiltersSidebar.tsx` - Ürün filtreleme yan paneli
- `ProductDetailClient.tsx` - Ürün detay sayfası

### **🔧 `/common` - Ortak Bileşenler**
- `ProductCard.tsx` - Tek ürün kartı bileşeni
- `RatingStars.tsx` - Yıldız derecelendirme sistemi
- `FeaturedCarousel.tsx` - Öne çıkan ürünler carousel'i

### **📚 `/context` - Context Bileşenleri**
- `AuthContext.tsx` - Kullanıcı kimlik doğrulama context'i
- `CartContext.tsx` - Alışveriş sepeti context'i
- `Providers.tsx` - Tüm context provider'ları birleştiren bileşen

## 🚀 **Kullanım**

### **Import Örnekleri:**

```typescript
// Ana dizinden import
import { Header, Footer } from '../components'

// Belirli klasörden import
import { Header } from '../components/layout'
import { ProductGrid } from '../components/products'
import { CompanySlider } from '../components/homepage'
```

### **Export Yapısı:**

```typescript
// src/components/index.ts
export * from './layout'      // Header, Footer
export * from './homepage'    // CompanySlider, BrandHeader, CampaignSlider
export * from './products'    // ProductGrid, FiltersSidebar, ProductDetailClient
export * from './common'      // ProductCard, RatingStars, FeaturedCarousel
```

## 🎯 **Avantajlar**

- ✅ **Organize Yapı**: Her sayfa için ayrı klasör
- ✅ **Kolay Bulma**: Component'ler mantıklı gruplarda
- ✅ **Ölçeklenebilir**: Yeni sayfalar için kolay genişletme
- ✅ **Import Basitliği**: Tek noktadan tüm component'lere erişim
- ✅ **Kod Okunabilirliği**: Geliştirici deneyimi artırıldı

## 🔄 **Son Güncellemeler**

- **Component mimarisi yeniden düzenlendi**
- **Sayfa bazlı klasör yapısı oluşturuldu**
- **Import/export sistemi optimize edildi**
- **Geriye dönük uyumluluk korundu**

## 📝 **Notlar**

- Tüm component'ler `src/components/index.ts` üzerinden export edilir
- Eski `ui/` klasörü geriye dönük uyumluluk için korunur
- Yeni component'ler ilgili klasörlere eklenmelidir
- Her klasör kendi `index.ts` dosyasına sahiptir
