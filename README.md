#  Services | خدمات 

## English

### Overview
 Services is a platform designed to connect restaurants and various services to provide donations or free meals to municipalities for distribution to those in need.

### Getting Started

To start the development server, run the following command:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Project Structure

The project is organized as follows:

- **`src/app`**: Contains the main application logic, including pages, API routes, and global styles.
- **`src/components`**: Reusable components for the application.
- **`src/lib`**: Utility files such as database connections and models.
- **`public`**: Static assets like images and icons.

### Features

- Add, view services.
- Filter services by category.
- Responsive design for all devices.
- Built with Next.js, React, and Tailwind CSS.

### Environment Variables

To run this project, you need to set up the following environment variables in a `.env` file:

```env
MONGODB_URI=<Your MongoDB Connection String>
IMGBB_API_KEY=<Your IMGBB API Key>
```

### Deployment

To deploy the application, use the following command:

```bash
npm run build && npm start
```

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## العربية

### نظرة عامة
خدمات  هي منصة تهدف إلى ربط المطاعم والخدمات المختلفة لتقديم التبرعات أو الوجبات المجانية للبلدية لتوزيعها على المحتاجين.

### كيفية البدء

لتشغيل خادم التطوير، قم بتشغيل الأمر التالي:

```bash
npm run dev
# أو
yarn dev
# أو
pnpm dev
# أو
bun dev
```

افتح [http://localhost:3000](http://localhost:3000) في متصفحك لعرض التطبيق.

### هيكل المشروع

تم تنظيم المشروع كالتالي:

- **`src/app`**: يحتوي على منطق التطبيق الرئيسي، بما في ذلك الصفحات ومسارات API والأنماط العامة.
- **`src/components`**: مكونات قابلة لإعادة الاستخدام للتطبيق.
- **`src/lib`**: ملفات الأدوات مثل اتصالات قاعدة البيانات والنماذج.
- **`public`**: الأصول الثابتة مثل الصور والأيقونات.

### الميزات

- إضافة وعرض  الخدمات.
- تصفية الخدمات حسب الفئة.
- تصميم متجاوب لجميع الأجهزة.
- مبني باستخدام Next.js و React و Tailwind CSS.

### متغيرات البيئة

لتشغيل هذا المشروع، تحتاج إلى إعداد متغيرات البيئة التالية في ملف `.env`:

```env
MONGODB_URI=<رابط اتصال MongoDB الخاص بك>
IMGBB_API_KEY=<مفتاح API الخاص بـ IMGBB>
```

### النشر

لنشر التطبيق، استخدم الأمر التالي:

```bash
npm run build && npm start
```

لمزيد من التفاصيل، راجع [وثائق نشر Next.js](https://nextjs.org/docs/app/building-your-application/deploying).
