# Portfolio Setup Guide

This guide will help you populate your portfolio website with content from your CV.

## 📋 What You Need to Do

### 1. Update Personal Information
Edit `data/portfolioData.ts` and update the `personalInfo` section with your details:

```typescript
personalInfo: {
  name: "Your Full Name",
  title: "Your Professional Title",
  location: "Your Location (e.g., 'Based in London, UK')",
  email: "your.email@example.com",
  phone: "+1234567890", // Optional
  linkedin: "https://linkedin.com/in/yourprofile", // Optional
  github: "https://github.com/yourusername", // Optional
  portfolio: "https://yourportfolio.com", // Optional
  summary: "Your professional summary (2-3 sentences about your expertise and passion)"
}
```

### 2. Add Your Work Experience
Replace the experience entries in the `experience` array:

```typescript
experience: [
  {
    position: "Your Job Title",
    company: "Company Name",
    location: "City, Country", // Optional
    period: "Start Date - End Date (e.g., 'Jan 2022 - Present')",
    description: [
      "Key achievement or responsibility 1",
      "Key achievement or responsibility 2",
      "Key achievement or responsibility 3"
    ],
    technologies: ["Tech1", "Tech2", "Tech3"] // Optional
  }
]
```

### 3. Add Your Education
Update the `education` array:

```typescript
education: [
  {
    degree: "Your Degree (e.g., 'Bachelor of Science in Computer Science')",
    institution: "University/Institution Name",
    location: "City, Country", // Optional
    period: "Start Year - End Year (e.g., '2018 - 2022')",
    description: "Brief description of your studies or focus areas" // Optional
  }
]
```

### 4. Organize Your Skills
Update the `skills` array with your technical skills organized by category:

```typescript
skills: [
  {
    category: "Frontend Development",
    skills: ["React", "Vue.js", "TypeScript", "JavaScript", "HTML5", "CSS3"]
  },
  {
    category: "Backend Development",
    skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "REST APIs"]
  },
  {
    category: "Design & Tools",
    skills: ["Figma", "Adobe XD", "Git", "Docker", "AWS"]
  }
]
```

### 5. Add Your Projects
Replace the project entries with your actual projects:

```typescript
projects: [
  {
    title: "Project Name",
    slug: "project-name", // URL-friendly version of the title
    category: ["Category1", "Category2"], // e.g., ["Full Stack", "E-Commerce"]
    img: "/images/project1_1.jpeg", // Use existing images or add your own
    owner: "Your Name",
    date: "Month Year", // e.g., "Dec 2023"
    services: "Services provided", // e.g., "Full Stack Development, UI/UX Design"
    duration: "Duration", // e.g., "45 Days"
    budget: "Budget", // e.g., "8000$" or "Personal Project"
    live: "https://project-url.com", // Live project URL
    overview: "Brief project overview (2-3 sentences)",
    objective: "Project objectives and goals (2-3 sentences)",
    process: "Development process and approach (3-4 sentences)",
    impact: "Results and impact (2-3 sentences)",
    technologies: ["Tech1", "Tech2", "Tech3"] // Optional
  }
]
```

### 6. Add Your Awards/Certifications (Optional)
Update the `awards` array:

```typescript
awards: [
  {
    title: "Award/Certification Name",
    organization: "Issuing Organization",
    year: "Year",
    description: "Brief description" // Optional
  }
]
```

## 🖼️ Adding Your Images

1. **Profile Photo**: Replace `/public/images/about.jpeg` with your professional photo
2. **Project Images**: Replace the project images in `/public/images/` with screenshots of your projects
3. **Image Requirements**:
   - Profile photo: Square format (500x500px recommended)
   - Project images: 700x700px or similar square format
   - Use JPG, PNG, or WebP formats

## 🎨 Customization Options

### Colors and Styling
- Edit `styles/variables.scss` to change colors, fonts, and other design variables
- The portfolio uses CSS custom properties for easy theming

### Layout and Sections
- You can reorder sections by modifying the component order in `pages/index.tsx`
- Add or remove sections by commenting out components

### Animations
- All animations are powered by GSAP and are already optimized
- You can adjust animation timing in individual component files

## 🚀 Deployment

1. **Local Development**:
   ```bash
   npm install
   npm run dev
   ```

2. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

3. **Deploy to Vercel** (Recommended):
   - Connect your GitHub repository to Vercel
   - Vercel will automatically deploy your site

## 📝 Content Tips

1. **Keep it Concise**: Use bullet points and short, impactful sentences
2. **Show Results**: Include metrics and achievements where possible
3. **Be Specific**: Mention specific technologies, tools, and methodologies
4. **Professional Tone**: Write in a professional but approachable tone
5. **Update Regularly**: Keep your portfolio current with your latest work

## 🔧 Technical Notes

- The portfolio is built with Next.js and TypeScript
- All animations use GSAP for smooth performance
- The design is fully responsive and mobile-friendly
- SEO optimized with proper meta tags and structured data
- Fast loading with optimized images and code splitting

## 📞 Support

If you need help customizing your portfolio or have questions about the setup process, feel free to reach out!

---

**Remember**: This is your professional showcase, so take the time to make it reflect your best work and personality!
