import React from 'react';

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-8">عن مشروعنا</h2>
        <p className="text-lg mb-12 max-w-2xl mx-auto">
          منصة شاملة تهدف إلى تسهيل التواصل وتقديم الخدمات لسكان القرية أو المنطقة. سواء كنت تبحث عن فرصة عمل، تحتاج إلى مساعدة، أو ترغب في تقديم خدمة، نحن هنا لنساعدك.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white text-gray-800 p-8 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4">إضافة خدمات بسهولة</h3>
            <p>
              يمكنك إضافة خدمتك أو عرض فرصة عمل مع تفاصيل واضحة ورقم للتواصل بكل سهولة.
            </p>
          </div>
          <div className="bg-white text-gray-800 p-8 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4">تواصل سريع</h3>
            <p>
              نوفر وسيلة سهلة للتواصل بين مقدمي الخدمات والمستفيدين مباشرة.
            </p>
          </div>
          <div className="bg-white text-gray-800 p-8 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4">مجتمع متكامل</h3>
            <p>
              نسعى لبناء مجتمع مترابط حيث يمكن للجميع مشاركة احتياجاتهم وخدماتهم.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;