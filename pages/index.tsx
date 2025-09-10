import AboutSection from "@/components/HomePage/AboutSection";
import AwardSection from "@/components/HomePage/AwardSection";
import BookCallSection from "@/components/HomePage/BookCallSection";
// import DribbleSection from "@/components/HomePage/DribbleSection";
import ExperienceSection from "@/components/HomePage/ExperienceSection";
import HeroSection from "@/components/HomePage/HeroSection";
import ProjectSection from "@/components/HomePage/ProjectSection";
import ServiceSection from "@/components/HomePage/ServiceSection";
import Head from "next/head";
import { portfolioData } from "@/data/portfolioData";

export default function HomePage() {

    return (
        <>
            <Head>
                <title>{portfolioData.personalInfo.name} | Home</title>
            </Head>
            <HeroSection />
            <AboutSection />
            <ExperienceSection />
            <ProjectSection />
            <ServiceSection />
            <AwardSection />
            {/* <DribbleSection /> */}
            <BookCallSection />
        </>
    );
}
