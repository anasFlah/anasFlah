import ContactSection from '@/components/ContactPage';
import BookCallSection from '@/components/HomePage/BookCallSection';
import Head from 'next/head';
import { portfolioData } from '@/data/portfolioData';

export default function ContactPage() {
    return (
        <>
            <Head>
                <title>{portfolioData.personalInfo.name} | Contact</title>
            </Head>
            <ContactSection />
            <BookCallSection />
        </>
    )
}