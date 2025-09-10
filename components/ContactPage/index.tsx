import { useEffect, useRef } from 'react';
import styles from './ContactPage.module.scss';
import { splitText } from '@/utils/textUtils';
import { gsap } from '@/libs/gsap';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolioData';

export default function ContactSection() {
    const bannerHeadingRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const tl = gsap.timeline({ paused: true });

        // Animate the banner heading
        if (bannerHeadingRef.current) {
            const headingSpans = bannerHeadingRef.current.querySelectorAll('span span');
            tl.from(headingSpans, { y: "105%", duration: 0.6, stagger: 0.1 }, 0.4);
        }

        // Animate the text before links
        if (textRef.current) {
            const headingSpans = textRef.current.querySelectorAll('span span');
            tl.from(headingSpans, { y: "115%", duration: 0.6, stagger: 0.001 }, 0.4);
        }

        // Animate links one by one using `fromTo`
        const links = document.querySelectorAll(`.${styles.linkSection} a`);
        if (links.length) {
            tl.fromTo(
                links,
                { opacity: 0, y: 20 }, // Starting values (links start from opacity 0 and y offset 20px)
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: "-.9" } // Ending values (links become visible with no y offset)
            );
        }

        // Play the animation
        tl.play();

        // Cleanup function to kill the timeline
        return () => {
            tl.kill();
        };
    }, []); // Empty dependency array to run once

    return (
        <>
            <section className={styles.contact}>
                <h1 ref={bannerHeadingRef}>{splitText("Contact")}</h1>
            </section>

            <section className={styles.linkSection}>
                <p ref={textRef}>{splitText("Contact me on")}</p>
                <div className={styles.wrapper}>
                    <Link href={`mailto:${portfolioData.personalInfo.email}`}>Email</Link>
                    {portfolioData.personalInfo.linkedin && (
                        <Link href={portfolioData.personalInfo.linkedin} target="_blank">LinkedIn</Link>
                    )}
                    {portfolioData.personalInfo.github && (
                        <Link href={portfolioData.personalInfo.github} target="_blank">GitHub</Link>
                    )}
                    {portfolioData.personalInfo.portfolio && (
                        <Link href={portfolioData.personalInfo.portfolio} target="_blank">Portfolio</Link>
                    )}
                </div>
            </section>
        </>
    );
}