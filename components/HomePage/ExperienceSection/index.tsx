import { useEffect, useRef } from 'react';
import { gsap } from '@/libs/gsap';
import styles from './ExperienceSection.module.scss';
import Tag from '@/components/Tag';
import { splitText } from '@/utils/textUtils';
import { portfolioData } from '@/data/portfolioData';

export default function ExperienceSection() {
    const headingRef = useRef<HTMLDivElement | null>(null);
    const experienceRef = useRef<HTMLDivElement | null>(null);

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

        // Animate experience items
        if (experienceRef.current) {
            const experienceItems = experienceRef.current.querySelectorAll(`.${styles.experienceItem}`);
            gsap.from(experienceItems, {
                scrollTrigger: {
                    trigger: experienceRef.current,
                    start: 'top 80%',
                    once: true,
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.2,
            });
        }
    }, []);

    return (
        <section className={styles.experience}>
            <div className={styles.container}>
                <div className={styles.heading} ref={headingRef}>
                    <Tag text="Experience" />
                    <h2>{splitText("Professional Journey")}</h2>
                </div>
                
                <div className={styles.experienceList} ref={experienceRef}>
                    {portfolioData.experience.map((exp, index) => (
                        <div key={index} className={styles.experienceItem}>
                            <div className={styles.header}>
                                <div className={styles.title}>
                                    <h3>{exp.position}</h3>
                                    <h4>{exp.company}</h4>
                                    {exp.location && <p className={styles.location}>{exp.location}</p>}
                                </div>
                                <div className={styles.period}>
                                    <span>{exp.period}</span>
                                </div>
                            </div>
                            
                            <div className={styles.description}>
                                <ul>
                                    {exp.description.map((desc, descIndex) => (
                                        <li key={descIndex}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            {exp.technologies && (
                                <div className={styles.technologies}>
                                    <h5>Technologies:</h5>
                                    <div className={styles.techList}>
                                        {exp.technologies.map((tech, techIndex) => (
                                            <span key={techIndex} className={styles.tech}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
