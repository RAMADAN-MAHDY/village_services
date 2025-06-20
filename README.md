
---

# **Village Services**  
**منصة لإدارة الخدمات وطلبات المساعدة**  

## 🏗️ **نظرة عامة**  
**Village Services** هو مشروع يعتمد على **Next.js**، حيث يهدف إلى تسهيل إدارة الخدمات المجتمعية من خلال واجهة مستخدم سهلة الاستخدام، وتكامل مع **MongoDB**، مع دعم **JWT** للمصادقة.  

## 🚀 **المميزات**  
✅ **إضافة وإدارة الخدمات**  
✅ **طلب المساعدة ومتابعة الطلبات**  
✅ **نظام تسجيل دخول آمن باستخدام JWT**  
✅ **تحميل الملفات باستخدام Multer & Busboy**  
✅ **دردشة AI مدمجة لمساعدة المستخدمين**  
✅ **استضافة على Vercel لسهولة النشر**  

## 📂 **هيكل المشروع**  
```bash
village_services/
├── public/               # الموارد العامة (مثل الصور والملفات الثابتة)
├── src/                  # الكود الأساسي للمشروع
│   ├── app/              # إدارة الصفحات باستخدام نظام التوجيه في Next.js
│   │   ├── api/                      # نقاط الوصول الخاصة بالخادم (API Routes)
│   │   │   ├── DELETE_Routes/                # حذف الخدمات والطلبات
│   │   │   ├── GET_Router/                   # التحقق من الجلسات والمصادقة باستخدام JWT
│   │   │   ├── POST_Routes/
│   │   │   │   └── chatRouter/              # إنشاء التضمين وإدارة الدردشة
│   │   │   ├── PUT_Routes/                  # تحديثات الخدمات – بعد إزالة الصفحات غير المستخدمة
│   │   │   ├── Providingservice/            # إدارة الخدمات (إضافة، تعديل، حذف)
│   │   │   └── users_and_HelpRequestSchema/ # تعريف بيانات المستخدمين وطلبات المساعدة
│   │   ├── Profile/                 # إدارة بيانات المستخدم وصفحة الملف الشخصي
│   │   ├── add-service/             # صفحة إضافة الخدمات من قبل المستخدمين
│   │   └── lib/                     # الأدوات والموديلات الخاصة بالبنية الخلفية
│   │       ├── models/                   
│   │       │   ├── HelpRequestSchema.ts         # نموذج يمثل بيانات طلبات المساعدة
│   │       │   ├── ProvidingserviceSchema.ts    # نموذج إدارة الخدمات المقدمة
│   │       │   └── UsersSchema.ts               # نموذج بيانات المستخدمين
│   │       ├── cookies.ts               # إدارة ملفات تعريف الارتباط (Cookies)
│   │       ├── jwt.ts                   # التعامل مع JSON Web Tokens للمصادقة
│   │       └── mongoose.ts              # الاتصال بقاعدة البيانات وإدارة النماذج
│   ├── components/       # المكونات القابلة لإعادة الاستخدام (Components)
│   │   ├── Forms/             # نماذج إدخال البيانات
│   │   ├── Home/              # مكونات الصفحة الرئيسية
│   │   ├── Layout/            # هيكلة الصفحات وتصميم الإطار العام
│   │   ├── Service/           # إدارة وعرض الخدمات
│   │   ├── Shared/            # مكونات مشتركة بين الصفحات (مثل الأزرار، العناوين)
│   │   ├── aboutUs/           # عناصر صفحة "من نحن"
│   │   ├── chatAi/            # مكونات الذكاء الاصطناعي والدردشة
│   │   ├── profile/           # مكونات الملف الشخصي
│   │   ├── showRequest/       # عرض الطلبات المقدمة
│   │   └── showSerices/       # عرض الخدمات المتوفرة
│
├── package.json          # ملف التبعيات وأوامر التشغيل
├── tsconfig.json         # إعدادات TypeScript
├── next.config.ts        # إعدادات Next.js
└── README.md             # هذا الملف


```

## ⚙️ **تشغيل المشروع**  
لتشغيل التطبيق محليًا، اتبع الخطوات التالية:  
```sh
git clone https://github.com/RAMADAN-MAHDY/village_services.git
cd village_services
npm install
npm run dev
```
**أو** يمكنك استخدام `yarn dev` أو `pnpm dev` حسب مدير الحزم لديك.  


---

💡
