import BookCallSection from "@/components/HomePage/BookCallSection";
import ProjectHeroSection from "@/components/ProjectPage/ProjectHeroSection";
import ProjectsSection from "@/components/ProjectPage/ProjectsSection";
import Head from "next/head";
import { portfolioData } from "@/data/portfolioData";

export default function ProjectPage() {

    return (
        <>
            <Head>
                <title>{portfolioData.personalInfo.name} | Projects</title>
            </Head>
            <ProjectHeroSection />
            <ProjectsSection />
            <BookCallSection />
        </>
    );
}