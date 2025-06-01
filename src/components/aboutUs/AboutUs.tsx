import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const timelineData = [
    {
        title: 'إضافة خدمات بسهولة',
        description: 'يمكنك إضافة خدمتك أو عرض فرصة عمل مع تفاصيل واضحة ورقم للتواصل بكل سهولة.',
    },
    {
        title: 'تواصل سريع',
        description: 'نوفر وسيلة سهلة للتواصل بين مقدمي الخدمات والمستفيدين مباشرة.',
    },
    {
        title: 'مجتمع متكامل',
        description: 'نسعى لبناء مجتمع مترابط حيث يمكن للجميع مشاركة احتياجاتهم وخدماتهم.',
    },
    {
        title: 'الرد بالمساعد الذكي',
        description: 'ميزة الرد بالمساعد الذكي تسهل عليك الوصول للخدمات التي تحتاجها بسرعة ودقة، مما يوفر وقتك وجهدك.',
    },
];

// const steps = [
//     { x: 30, y: 100 },
//     { x: 30, y: 200 },
//     { x: 30, y: 350 },
//     { x: 30, y: 470 },
//     { x: 30, y: 570 },
//     { x: 30, y: 690 },
//     // { x: 100, y: 900 },
//     { x: 100, y: 690 },
//     { x: 100, y: 580 },
//     { x: 100, y: 480 },
//     { x: 100, y: 380 },
//     { x: 100, y: 280 },
//     { x: 100, y: 180 },
//     { x: 100, y: 50 },
//     { x: 100, y: 50 },
// ]; // 🟡 غير دي بالخطوات اللي تحبها

const AboutUs = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const segmentRefs = useRef<HTMLDivElement[]>([]);

    const [steps, setSteps] = useState<{ x: number; y: number }[]>([]);

useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const newSteps = [
        { x: 5, y: 10 },
        { x: 5, y: 20 },
        { x: 5, y: 30 },
        { x: 5, y: 40 },
        { x: 5, y: 50 },
        { x: 5, y: 60 },
        { x: 5, y: 70 },
        // { x: 30, y: 85 },
        // { x: 60, y: 85 },
        { x: 60, y: 60 },
        { x: 60, y: 50 },
        { x: 60, y: 40 },
        { x: 60, y: 30 },
        { x: 60, y: 20 },
        { x: 60, y: 10 },
        { x: 60, y: 5 },
        { x: 60, y: -4 },
    ].map(({ x, y }) => ({
        x: (x / 100) * width,
        y: (y / 100) * height,
    }));

    setSteps(newSteps);
}, []);


 useEffect(() => {
    if (steps.length === 0) return;

    const head = headRef.current!;
    const segments = segmentRefs.current;

    const history: { x: number; y: number }[] = [];

    const ticker = () => {
        const headBox = head.getBoundingClientRect();
        const containerBox = containerRef.current!.getBoundingClientRect();

        const relativeX = headBox.left - containerBox.left;
        const relativeY = headBox.top - containerBox.top;

        history.unshift({ x: relativeX, y: relativeY });
        if (history.length > 100) history.pop();

        segments.forEach((seg, i) => {
            const index = (i + 1) * 0.5;
            const pos = history[index];
            if (pos && seg) {
                gsap.set(seg, {
                    x: pos.x,
                    y: pos.y,
                });
            }
        });
    };

    gsap.ticker.add(ticker);

    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 1, ease: "power1.inOut" } });
    steps.forEach(({ x, y }) => {
        tl.to(headRef.current, { x, y });
    });

    return () => {
        gsap.ticker.remove(ticker);
        tl.kill();
    };
}, [steps]);


    return (
        <section className="bg-gradient-to-r font-semibold from-blue-500 to-purple-600 text-white py-16 px-6">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-extrabold mb-8">من نحن</h2>
                <p className="text-lg mb-12 max-w-2xl mx-auto">
                    منصة شاملة تهدف إلى تسهيل التواصل وتقديم الخدمات لسكان القرية أو المنطقة. سواء كنت تبحث عن فرصة عمل، تحتاج إلى مساعدة، أو ترغب في تقديم خدمة، نحن هنا لنساعدك.
                </p>

                <div ref={containerRef} className="relative grid grid-cols-1 pt-2 rounded-2xl bg-[#2244224d] lg:w-[70%] gap-8 mx-auto">
                    {timelineData.map((item, i) => (
                        <motion.div
                            key={i}
                            className="timeline-card z-20 bg-white text-gray-800 p-8 shadow-lg rounded-lg mb-8 md:mb-0 md:mx-4 hover:scale-105 hover:shadow-2xl transition-transform duration-300 relative"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.3 }}
                        >
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p>{item.description}</p>
                        </motion.div>
                    ))}

                    {/* 🐍 الثعبان */}
                    <div className="absolute z-10 top-[10%] left-11 w-full h-full pointer-events-none">
                        <div
                            ref={headRef}
                            className="w-4 h-4 rounded-full absolute"
                         
                        />
                        {[...Array(100)].map((_, i) => (
                            <div
                                key={i}
                                ref={(el) => {
                                    if (el) segmentRefs.current[i] = el;
                                }}
                                className="w-4 h-4 rounded-xl left-[-19] absolute"
                                style={{
                                    backgroundColor: "#39FF14",
                                    boxShadow: "0 0 6px 2px #39FF14",
                                }}
                            />
                        ))}

                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutUs;
