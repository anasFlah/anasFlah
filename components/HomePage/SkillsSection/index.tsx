import { useEffect, useRef } from 'react';
import { gsap } from '@/libs/gsap';
import styles from './SkillsSection.module.scss';
import Tag from '@/components/Tag';
import { splitText } from '@/utils/textUtils';
import { portfolioData } from '@/data/portfolioData';

export default function SkillsSection() {
    const headingRef = useRef<HTMLDivElement | null>(null);
    const skillsRef = useRef<HTMLDivElement | null>(null);

    // Debug: Check if skills data is available
    console.log('Skills data:', portfolioData.skills);
    console.log('Skills length:', portfolioData.skills?.length);



    useEffect(() => {
        // Animate heading
        if (headingRef.current) {
            const headingSpans = headingRef.current.querySelectorAll('span span');
            gsap.from(headingSpans, {
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: 'top 80%',
                    once: true,
                },
                y: '115%',
                duration: 0.6,
                stagger: 0.005,
            });
        }

        // Animate skills
        if (skillsRef.current) {
            const skillItems = skillsRef.current.querySelectorAll(`.${styles.skillItem}`);
            gsap.from(skillItems, {
                scrollTrigger: {
                    trigger: skillsRef.current,
                    start: 'top 80%',
                    once: true,
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.1,
            });
        }
    }, []);

    return (
        <section className={styles.skills} style={{ background: '#000', color: '#fff', padding: '120px 0' }}>
            <div className={styles.container}>
                <div className={styles.heading} ref={headingRef}>
                    <Tag text="Skills" />
                    <h2>{splitText("Technical Expertise & Tools")}</h2>
                </div>
                
                <div className={styles.skillsGrid} ref={skillsRef} style={{ display: 'grid', gap: '40px' }}>
                    {portfolioData.skills && portfolioData.skills.length > 0 ? (
                        portfolioData.skills.map((skillCategory, index) => (
                            <div key={index} className={styles.skillItem} style={{ background: 'rgba(255,255,255,0.1)', padding: '30px', borderRadius: '12px' }}>
                                <h3 style={{ color: '#E0E0E0', fontSize: '1.5rem', marginBottom: '20px' }}>{skillCategory.category}</h3>
                                <div className={styles.skillList} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {skillCategory.skills.map((skill, skillIndex) => (
                                        <span key={skillIndex} className={styles.skill} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '20px' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.skillItem} style={{ background: 'rgba(255,255,255,0.1)', padding: '30px', borderRadius: '12px' }}>
                            <h3 style={{ color: '#E0E0E0', fontSize: '1.5rem', marginBottom: '20px' }}>Skills Data Not Loading</h3>
                            <div className={styles.skillList} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                <span className={styles.skill} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '20px' }}>React</span>
                                <span className={styles.skill} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '20px' }}>Vue.js</span>
                                <span className={styles.skill} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '20px' }}>GSAP</span>
                                <span className={styles.skill} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '20px' }}>WordPress</span>
                                <span className={styles.skill} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '20px' }}>Node.js</span>
                                <span className={styles.skill} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '20px' }}>TypeScript</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
