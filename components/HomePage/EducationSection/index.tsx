import { useEffect, useRef } from 'react';
import { gsap } from '@/libs/gsap';
import styles from './EducationSection.module.scss';
import Tag from '@/components/Tag';
import { splitText } from '@/utils/textUtils';
import { portfolioData } from '@/data/portfolioData';

export default function EducationSection() {
    const headingRef = useRef<HTMLDivElement | null>(null);
    const educationRef = useRef<HTMLDivElement | null>(null);

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

        // Animate education items
        if (educationRef.current) {
            const educationItems = educationRef.current.querySelectorAll(`.${styles.educationItem}`);
            gsap.from(educationItems, {
                scrollTrigger: {
                    trigger: educationRef.current,
                    start: 'top 80%',
                    once: true,
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.2,
            });
        }
    }, []);

    return (
        <section className={styles.education}>
            <div className={styles.container}>
                <div className={styles.heading} ref={headingRef}>
                    <Tag text="Education" />
                    <h2>{splitText("Academic Background")}</h2>
                </div>
                
                <div className={styles.educationGrid} ref={educationRef}>
                    {portfolioData.education.map((edu, index) => (
                        <div key={index} className={styles.educationItem}>
                            <div className={styles.degree}>
                                <h3>{edu.degree}</h3>
                                <h4>{edu.institution}</h4>
                                {edu.location && <p className={styles.location}>{edu.location}</p>}
                            </div>
                            
                            <div className={styles.period}>
                                <span>{edu.period}</span>
                            </div>
                            
                            {edu.description && (
                                <div className={styles.description}>
                                    <p>{edu.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
