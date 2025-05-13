# 📘 شرح ملفات المشروع

هذا الملف يحتوي على توثيق مبسط يوضح وظيفة كل ملف في المشروع، سواء من جانب الواجهة الأمامية (Front-end) أو الخلفية (Back-end).

---

## 🖥️ الواجهة الأمامية (Front-end)

### 📄 `page.tsx`
يمثل الصفحة الرئيسية للتطبيق.  
يتم استيراد مكونات مثل `HeroSection` و `ShowServices` لعرض قسم البطل والخدمات المتوفرة داخل JSX.

---

### 📄 `loading.tsx`
يعرض شاشة تحميل (Loading Screen) بتصميم بسيط باستخدام Tailwind CSS.  
يُستخدم أثناء تحميل البيانات.

---

### 📄 `not-found.tsx`
يعرض صفحة خطأ 404 عند محاولة الوصول إلى صفحة غير موجودة.  
يعتمد على مكون `SectionTitle`.

---

### 📄 `AddServiceForm.tsx`
نموذج لإضافة خدمة جديدة.  
يستخدم React hooks لإدارة الحالة مثل:  
- الوصف  
- الصورة  
- رقم الهاتف  
- الفئة  
- طرق الاتصال  

يتم التحقق من صحة البيانات قبل إرسالها إلى الخادم باستخدام `fetch`.

---

### 📄 `HeroSection.tsx`
يعرض قسم البطل (Hero Section) في الصفحة الرئيسية.  
يتضمن نصوص تعريفية وتصميم جذاب باستخدام Tailwind CSS.

---

### 📄 `Footer.tsx`
مكون يعرض تذييل الصفحة (Footer) مع حقوق الملكية وبعض المعلومات عن فريق التطوير.  
مصمم باستخدام Tailwind CSS.

---

### 📄 `Navbar.tsx`
شريط التنقل بين الصفحات.  
يستخدم `useState` لتحديد الرابط النشط (active).

---

### 📄 `Container.tsx`
مكون لتغليف المحتوى ضمن تصميم موحد باستخدام Tailwind CSS.

---

### 📄 `showServices.tsx`
يعرض قائمة الخدمات المتوفرة.  
يتم:
- جلب البيانات من API باستخدام `fetch`
- تصفية النتائج حسب الفئة
- عرض الخدمات بتنسيق شبكة (Grid) مع تفاصيل مثل الصورة وطرق الاتصال

---

### 📄 `globals.css`
ملف إعدادات CSS العامة باستخدام Tailwind CSS.  
يحدد الألوان والخطوط الافتراضية للتطبيق.

---

## 📦 الواجهة الخلفية (Back-end)

### 📄 `UsersSchema.ts`
تعريف مخطط مستخدمي التطبيق باستخدام Mongoose.  
الحقول تشمل:
- رقم الهاتف (phone)
- واتساب (whatsapp)
- البريد الإلكتروني (email)
- تاريخ الإنشاء (createdAt)

يتم استخدام المخطط لإنشاء نموذج (Model) لمستخدمي التطبيق.

---

### 📄 `ProvidingserviceSchema.ts`
مخطط الخدمات المقدمة.  
يشمل الحقول:
- المستخدم المرتبط بالخدمة (user)
- الوصف (description)
- الفئة (category)
- طرق الاتصال (contactMethods)
- الصورة (image)

يحتوي أيضًا على تحقق من صحة البريد الإلكتروني باستخدام Regex.

---

### 📄 `mongoose.ts`
منطق الاتصال بقاعدة بيانات MongoDB باستخدام مكتبة Mongoose.  
يقوم بـ:
- تعريف متغير URI الخاص بالاتصال
- إعادة استخدام الاتصال إذا كان موجودًا مسبقًا
- تسجيل حالة الاتصال في Console

---

### 📄 `route.ts`
نقطة API لجلب الخدمات (`Providingservice`) من قاعدة البيانات.  
- إذا تم تمرير معرف (ID): يتم جلب خدمة واحدة  
- إذا لم يتم تمرير معرف: يتم جلب جميع الخدمات  

يتم استخدام `populate` لجلب بيانات المستخدم المرتبط بالخدمة، مع استثناء كلمة المرور.

---

### 📄 `Providingservice/route.ts`
نقطة API لإضافة خدمة جديدة.  
تستخدم:
- مكتبة `Busboy` لمعالجة البيانات والملفات
- تحقق من وجود المستخدم أو إنشاءه
- رفع الصور إلى خدمة خارجية (مثل imgbb)
- إنشاء مستند جديد في قاعدة البيانات يحتوي على تفاصيل الخدمة

---

## ✅ ملاحظات إضافية
- كل العمليات الحيوية مثل الإضافة، الجلب، التحقق من الصحة، وربط المستخدمين تتم من خلال MongoDB وMongoose.
- تصميم الواجهة بالكامل يعتمد على Tailwind CSS.
- بعض الأجزاء مثل رفع الصور تعتمد على خدمات خارجية.

---

## 🖥️ Ön Yüz (Front-end)

### 📄 `page.tsx`
Uygulamanın ana sayfasını temsil eder.  
`HeroSection` ve `ShowServices` gibi bileşenler JSX içinde görüntülenir.

---

### 📄 `loading.tsx`
Basit bir tasarımla yükleme ekranı (Loading Screen) gösterir.  
Veriler yüklenirken kullanılır.

---

### 📄 `not-found.tsx`
404 hata sayfasını gösterir.  
`SectionTitle` bileşenine dayanır.

---

### 📄 `AddServiceForm.tsx`
Yeni bir hizmet eklemek için form.  
Durum yönetimi için React hook'ları kullanır:  
- Açıklama  
- Görsel  
- Telefon numarası  
- Kategori  
- İletişim yöntemleri  

Veriler sunucuya gönderilmeden önce doğrulanır.

---

### 📄 `HeroSection.tsx`
Ana sayfada kahraman bölümü (Hero Section) gösterir.  
Tanıtıcı metinler ve Tailwind CSS ile çekici bir tasarım içerir.

---

### 📄 `Footer.tsx`
Sayfa altbilgisini (Footer) geliştirici ekibi hakkında bilgilerle birlikte gösterir.  
Tailwind CSS ile tasarlanmıştır.

---

### 📄 `Navbar.tsx`
Sayfalar arasında gezinme çubuğu.  
Aktif bağlantıyı belirlemek için `useState` kullanır.

---

### 📄 `Container.tsx`
İçeriği tek tip bir tasarım içinde sarmak için bileşen.  
Tailwind CSS kullanır.

---

### 📄 `showServices.tsx`
Mevcut hizmetlerin listesini gösterir.  
- Veriler `fetch` ile API'den alınır  
- Sonuçlar kategoriye göre filtrelenir  
- Hizmetler, görsel ve iletişim detaylarıyla birlikte bir ızgara (Grid) düzeninde gösterilir

---

### 📄 `globals.css`
Tailwind CSS kullanılarak genel CSS ayarları dosyası.  
Uygulamanın varsayılan renklerini ve yazı tiplerini belirler.

---

## 📦 Arka Yüz (Back-end)

### 📄 `UsersSchema.ts`
Mongoose kullanılarak uygulama kullanıcılarının şeması tanımlanır.  
Alanlar şunları içerir:  
- Telefon numarası (phone)  
- WhatsApp (whatsapp)  
- E-posta (email)  
- Oluşturulma tarihi (createdAt)  

Bu şema, uygulama kullanıcıları için bir model (Model) oluşturmak için kullanılır.

---

### 📄 `ProvidingserviceSchema.ts`
Sağlanan hizmetlerin şeması.  
Alanlar şunları içerir:  
- Hizmetle ilişkili kullanıcı (user)  
- Açıklama (description)  
- Kategori (category)  
- İletişim yöntemleri (contactMethods)  
- Görsel (image)  

Ayrıca Regex kullanılarak e-posta doğrulaması içerir.

---

### 📄 `mongoose.ts`
Mongoose kütüphanesi kullanılarak MongoDB veritabanına bağlanma mantığı.  
- Bağlantı için URI değişkenini tanımlar  
- Bağlantı zaten mevcutsa yeniden kullanır  
- Bağlantı durumunu Konsol'da kaydeder

---

### 📄 `route.ts`
Veritabanından hizmetleri (`Providingservice`) almak için API uç noktası.  
- Bir kimlik (ID) iletilirse: Tek bir hizmet alınır  
- Kimlik iletilmezse: Tüm hizmetler alınır  

`populate` kullanılarak hizmetle ilişkili kullanıcı verileri alınır, ancak şifre hariç tutulur.

---

### 📄 `Providingservice/route.ts`
Yeni bir hizmet eklemek için API uç noktası.  
- Verileri ve dosyaları işlemek için `Busboy` kütüphanesi kullanılır  
- Kullanıcının varlığı kontrol edilir veya oluşturulur  
- Görseller harici bir hizmete (ör. imgbb) yüklenir  
- Hizmetin detaylarını içeren yeni bir belge veritabanına eklenir

---

## ✅ Ek Notlar
- Ekleme, alma, doğrulama ve kullanıcıları ilişkilendirme gibi tüm temel işlemler MongoDB ve Mongoose aracılığıyla gerçekleştirilir.
- Tüm ön yüz tasarımı Tailwind CSS'e dayanır.
- Görsel yükleme gibi bazı bölümler harici hizmetlere dayanır.
