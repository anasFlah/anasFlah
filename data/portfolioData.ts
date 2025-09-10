export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
}

export interface Experience {
  position: string;
  company: string;
  location?: string;
  period: string;
  description: string[];
  technologies?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  period: string;
  description?: string;
}

export interface Skill {
  category: string;
  skills: string[];
}

export interface Project {
  title: string;
  slug: string;
  category: string[];
  img: string;
  owner: string;
  date: string;
  services: string;
  duration: string;
  budget: string;
  live: string;
  overview: string;
  objective: string;
  process: string;
  impact: string;
  technologies?: string[];
}

export interface Award {
  title: string;
  organization: string;
  year: string;
  description?: string;
}

// Portfolio data structure
export const portfolioData = {
  personalInfo: {
    name: "Anes Flah",
    title: "Creative Developer & Immersive Design Specialist",
    location: "Based in Tunisia",
    email: "anes.ben.flah@gmail.com",
    phone: "+216 54 951 694",
    linkedin: "https://linkedin.com/in/anes-flah",
    github: "https://github.com/anasFlah",
    portfolio: "https://anesflah.com",
    summary: "Creative developer with 5+ years of experience specializing in immersive web experiences, interactive design, and modern web technologies. Expert in Framer, GSAP animations, and full-stack development with a passion for creating engaging digital solutions that push the boundaries of web design. Background in digital marketing and travel industry providing unique perspective on user experience and business needs."
  },

  experience: [
    {
      position: "Creative Developer & Immersive Design Specialist",
      company: "Freelance & Agency Projects",
      location: "Tunisia & Remote",
      period: "2023 - 2025",
      description: [
        "Specialized in creating immersive web experiences using Framer, GSAP, and modern web technologies",
        "Developed interactive prototypes and animations that enhance user engagement and brand storytelling",
        "Collaborated with design teams to bring creative concepts to life through code and animation",
        "Implemented advanced CMS solutions including WordPress, Drupal, and custom headless CMS systems"
      ],
      technologies: ["Framer", "GSAP", "React", "Vue.js", "WordPress", "Drupal", "Node.js", "MongoDB"]
    },
    {
      position: "Creative Developer & SEO Specialist",
      company: "USA Drone Solutions Company",
      location: "Remote",
      period: "2022 - 2023",
      description: [
        "Developed interactive web applications and immersive experiences for drone technology solutions",
        "Implemented organic SEO strategies and technical optimization for B2B clients",
        "Created engaging web content with modern animations and interactive elements",
        "Collaborated with international teams to deliver innovative web solutions"
      ],
      technologies: ["React", "Vue.js", "SEO", "GSAP", "WordPress", "Content Creation", "Web Development"]
    },
    {
      position: "Creative Developer & Branding Specialist",
      company: "Digital Marketing Agency",
      location: "Tunisia",
      period: "2021 - 2022",
      description: [
        "Developed custom web applications and interactive experiences for diverse client portfolios",
        "Created brand identities and visual systems for client projects",
        "Implemented organic SEO strategies and technical website optimization",
        "Built engaging digital experiences with modern web technologies and animations"
      ],
      technologies: ["React", "Vue.js", "Branding", "SEO", "GSAP", "Web Development", "UI/UX Design"]
    },
    {
      position: "Creative Developer",
      company: "Digital Marketing Agency",
      location: "Tunisia",
      period: "2020 - 2021",
      description: [
        "Developed web applications and interactive marketing tools using modern technologies",
        "Implemented organic SEO strategies and technical optimization for client websites",
        "Created engaging user interfaces and interactive experiences",
        "Built custom solutions for marketing automation and analytics integration"
      ],
      technologies: ["React", "Vue.js", "SEO", "JavaScript", "Web Development", "UI/UX", "Analytics"]
    },
    {
      position: "Web Developer",
      company: "Travel Agency",
      location: "Tunisia",
      period: "2020 - 2020",
      description: [
        "Developed web-based booking systems and travel management tools",
        "Created responsive websites and interactive travel planning interfaces",
        "Implemented SEO optimization for travel-related content and services",
        "Built custom solutions for travel booking and customer engagement"
      ],
      technologies: ["JavaScript", "HTML/CSS", "SEO", "Web Development", "Booking Systems", "Responsive Design"]
    }
  ],

  education: [
    {
      degree: "Full Stack JavaScript Developer Training",
      institution: "ReBootKamp Tunisia (RBK TN)",
      location: "Tunisia",
      period: "2020",
      description: "Intensive training program covering modern web development technologies, team collaboration, and project management"
    },
    {
      degree: "Baccalaureate Level in Computer Science",
      institution: "Computer Science Program",
      location: "Tunisia",
      period: "2019",
      description: "Foundation in computer science principles, programming fundamentals, and software development concepts"
    }
  ],

  skills: [
    {
      category: "Immersive Design & Animation",
      skills: ["Framer", "GSAP", "Three.js", "WebGL", "Canvas API", "CSS Animations", "Interactive Design"]
    },
    {
      category: "Frontend Development",
      skills: ["React", "Vue.js", "Angular", "JavaScript", "TypeScript", "HTML5", "CSS3", "SCSS", "Tailwind CSS"]
    },
    {
      category: "Backend Development", 
      skills: ["Node.js", "Express.js", "PHP", "MongoDB", "MySQL", "REST APIs", "GraphQL"]
    },
    {
      category: "CMS & Content Management",
      skills: ["WordPress", "Drupal", "Strapi", "Contentful", "Sanity", "Headless CMS"]
    },
    {
      category: "Design & Creative Tools",
      skills: ["Figma", "Adobe Creative Suite", "Sketch", "InVision", "Prototyping", "UX/UI Design"]
    },
    {
      category: "Development Tools",
      skills: ["Git", "GitHub", "VS Code", "Webpack", "Vite", "Docker", "AWS"]
    }
  ],

  projects: [
    {
      title: "Shesup - Faux Bijoux E-commerce",
      slug: "shesup-ecommerce",
      category: ["E-commerce Development", "PrestaShop", "Growth Hacking", "UI/UX Design"],
      img: "/images/shesup.png",
      owner: "Shesup",
      date: "Jan 2025",
      services: "E-commerce Development, PrestaShop, Growth Hacking, Figma Design, SEO Optimization",
      duration: "60 Days",
      budget: "12000$",
      live: "https://shesup.com/",
      overview: "Shesup represents a comprehensive e-commerce solution for faux bijoux (fashion jewelry), built from the ground up using PrestaShop. This project showcases the perfect blend of technical expertise, growth hacking strategies, and creative design to create a high-performing online jewelry store. The platform was designed to provide an exceptional shopping experience while implementing advanced growth hacking techniques to maximize conversions and customer engagement.",
      objective: "Create a fully functional e-commerce platform for faux bijoux that combines technical excellence with growth hacking strategies. The goal was to build a PrestaShop-based solution that not only looks stunning but also performs exceptionally well in terms of SEO, user experience, and conversion optimization. The project required implementing growth hacking techniques to drive traffic, increase sales, and establish a strong online presence in the competitive fashion jewelry market.",
      process: "The development process began with comprehensive market research and competitor analysis to understand the faux bijoux industry landscape. I designed the entire user interface and user experience using Figma, creating wireframes and prototypes that focused on conversion optimization and user engagement. The PrestaShop development involved custom theme creation, payment gateway integration, inventory management systems, and advanced product catalog features. I implemented growth hacking strategies including A/B testing, email marketing automation, social media integration, and referral programs. The SEO optimization included technical SEO improvements, content strategy, keyword optimization, and performance enhancements. The project also involved creating custom modules for advanced features like wishlist functionality, product recommendations, and customer loyalty programs.",
      impact: "Shesup has successfully established itself as a leading online destination for faux bijoux, achieving significant growth in both traffic and sales. The platform's SEO-friendly architecture has resulted in improved search engine rankings and organic traffic growth. The growth hacking strategies implemented have led to increased customer acquisition and retention rates. The performance optimization has resulted in faster loading times and improved user experience, contributing to higher conversion rates and customer satisfaction. The project demonstrates the successful integration of e-commerce development, growth hacking, and design expertise to create a profitable online business.",
      technologies: ["PrestaShop", "PHP", "MySQL", "Figma", "Growth Hacking", "SEO", "JavaScript", "CSS3", "HTML5", "Analytics"]
    },
    {
      title: "BK Food International",
      slug: "bk-food-international",
      category: ["WordPress Development", "Immersive Design", "GSAP Animation"],
      img: "/images/bk-food-international-hero.png",
      owner: "BK Food International",
      date: "Dec 15, 2024",
      services: "WordPress Development, Immersive Design, GSAP Animation",
      duration: "45 Days",
      budget: "8500$",
      live: "https://bkfoodinternational.com/",
      overview: "BK Food International represents a groundbreaking fusion of WordPress development and immersive web design, creating a digital experience that transports visitors from their screens directly into the depths of the ocean. This project showcases the power of GSAP (GreenSock Animation Platform) to create living, breathing web experiences that go beyond traditional static websites. The goal was to create a website that doesn't just tell the story of a seafood company but immerses users in the journey from sea to table through dynamic animations and interactive elements.",
      objective: "The primary objective was to revolutionize how users interact with a corporate website by implementing cutting-edge GSAP animations that create a truly immersive underwater experience. Every element was designed to feel alive and responsive, from the stylized fish that leap across the screen to the gentle bobbing of the fishing boat and the dynamic school of fish that responds to user interaction. The WordPress backend needed to be seamlessly integrated with these advanced frontend animations, ensuring that content management remained simple while delivering a complex, engaging user experience. The challenge was to balance technical sophistication with usability, creating a website that feels magical without sacrificing performance or accessibility. The underwater theme was brought to life through multiple layers of animation: caustic light effects that simulate underwater lighting, parallax scrolling that creates depth, and interactive elements that respond to user movement. The GSAP animations were carefully orchestrated to create a sense of being underwater, with elements moving at different speeds and directions to simulate the natural flow of ocean currents.",
      process: "The development process began with extensive research into underwater photography and marine life movement patterns to ensure the animations felt authentic and natural. I studied how light behaves underwater, how fish move in schools, and how water surfaces create ripples and reflections. This research informed every animation decision, from the timing of fish movements to the color gradients used in the underwater scenes. The WordPress integration required custom development to ensure that the dynamic content could be easily managed while maintaining the complex animation sequences. I built custom post types for products, testimonials, and company information, all while ensuring that the GSAP animations could pull data from these sources without breaking the immersive experience. The technical implementation involved creating a layered animation system where different elements could be controlled independently. The jumping fish animations were built using GSAP's timeline features, with each fish having its own movement pattern that could be triggered based on scroll position or user interaction. The underwater scene was created using multiple background layers with parallax effects, while the school of fish was implemented as a particle system that could respond to mouse movement. Performance optimization was crucial, as the complex animations needed to run smoothly across all devices. I implemented lazy loading for animation assets and used GSAP's built-in performance features to ensure smooth 60fps animations even on mobile devices.",
      impact: "The launch of BK Food International's immersive website has transformed how the company presents itself online, creating a memorable brand experience that sets them apart from competitors. The website has received industry recognition for its innovative use of GSAP animations and has significantly increased user engagement metrics, with visitors spending an average of 4.5 minutes on the site compared to the industry average of 2 minutes. The immersive design has also improved conversion rates, with a 40% increase in contact form submissions and a 60% boost in product inquiries. The project has established BK Food International as a forward-thinking company that values both technology and user experience, helping them attract new clients and partners who appreciate innovative digital solutions. The success of this project has opened new opportunities for similar immersive web experiences in the food and beverage industry.",
      technologies: ["WordPress", "GSAP", "PHP", "JavaScript", "CSS3", "HTML5", "Custom Animations", "Parallax Effects"]
    },
    {
      title: "Foodify - Social Media Platform",
      slug: "foodify-social-media",
      category: ["Full Stack", "Social Media", "Team Project"],
      img: "/images/Thumbnail.png",
      owner: "Anes Flah",
      date: "Dec 2023",
      services: "Full Stack Development, UX/UI Design, Team Leadership",
      duration: "60 Days",
      budget: "Team Project",
      live: "https://github.com/anasFlah/foodify",
      overview: "A comprehensive social media platform focused on food sharing and community building. Built as a team project where I served as both developer and motivator, leading the design and UX aspects while implementing core functionality including user authentication, content sharing, and interactive features.",
      objective: "Create an engaging social media platform that connects food enthusiasts through sharing, liking, and reporting features. The goal was to build a scalable application with intuitive user experience and robust backend functionality using modern web technologies.",
      process: "As team member and motivator, I led the design and UX responsibilities while implementing key features. The frontend was built using Vue.js with Vuesax for design components, creating a modern and responsive interface. The backend utilized Node.js with MongoDB for data management, and I implemented the sign-up system, like/report functionality, navbar, search bar, and landing page systems. I also served as Test Manager, ensuring comprehensive quality assurance.",
      impact: "The platform successfully demonstrated team collaboration and technical expertise, showcasing modern web development practices. The project highlighted my ability to lead design initiatives while contributing to full-stack development, resulting in a fully functional social media application with engaging user experience.",
      technologies: ["Vue.js", "Vuesax", "Node.js", "MongoDB", "Express", "Axios", "JavaScript"]
    },
    // {
    //   title: "Mixology - Beverage Website",
    //   slug: "mixology-beverage-website",
    //   category: ["Full Stack", "E-Commerce", "Interactive"],
    //   img: "/images/project2_1.jpeg",
    //   owner: "Anes Flah",
    //   date: "Oct 2023",
    //   services: "Full Stack Development, Interactive Design",
    //   duration: "40 Days",
    //   budget: "Personal Project",
    //   live: "https://github.com/anasFlah/mixology",
    //   overview: "An interactive beverage website featuring age verification, recipe management, and blog functionality. The project showcases advanced JavaScript implementations including slideshow animations, CRUD operations, and user data management without traditional database systems.",
    //   objective: "Develop an engaging beverage platform with age verification, recipe sharing, and interactive features. The focus was on creating smooth user experiences with custom animations and efficient data management systems.",
    //   process: "Built using HTML5, CSS3, and JavaScript, I implemented an innovative age verification system that saves user data without traditional database management. Created a comprehensive CRUD system for recipes, developed interactive navbar and search functionality, and implemented custom slideshow animations. The rendering system efficiently manages blog and recipe content display.",
    //   impact: "The project demonstrates innovative approaches to user data management and interactive web design. The age verification system and custom animations showcase creative problem-solving skills, while the CRUD functionality provides a solid foundation for content management.",
    //   technologies: ["HTML5", "CSS3", "JavaScript", "Node.js", "MongoDB", "Axios", "Custom Animations"]
    // },
    // {
    //   title: "COVID-19 Status Tracker",
    //   slug: "covid19-status-tracker",
    //   category: ["Full Stack", "Data Visualization", "Real-time"],
    //   img: "/images/project3_1.png",
    //   owner: "Anes Flah",
    //   date: "Sep 2023",
    //   services: "Full Stack Development, Data Integration",
    //   duration: "30 Days",
    //   budget: "Personal Project",
    //   live: "https://github.com/anasFlah/covid19-status",
    //   overview: "A real-time COVID-19 status tracking website built with the MERN stack. Features live data updates, interactive visualizations, and comprehensive status monitoring capabilities. The application provides users with current pandemic information through an intuitive and responsive interface.",
    //   objective: "Create a real-time COVID-19 tracking platform that provides accurate, up-to-date information to users. The goal was to build a reliable data visualization tool with smooth user experience and efficient data management.",
    //   process: "Developed using React.js for the frontend with MongoDB and Mongoose for data management. Implemented real-time data fetching using Axios for HTTP requests, created comprehensive status update systems, and built a responsive interface that displays current pandemic statistics effectively.",
    //   impact: "The application successfully provides real-time COVID-19 information to users, demonstrating proficiency in data integration and real-time web applications. The project showcases full-stack development skills and ability to work with external APIs and data visualization.",
    //   technologies: ["React.js", "Node.js", "MongoDB", "Mongoose", "Axios", "JavaScript", "CSS3"]
    // }
  ],

  awards: [
    {
      title: "Full Stack JavaScript Developer Certification",
      organization: "ReBootKamp Tunisia (RBK TN)",
      year: "2020",
      description: "Completed intensive full-stack development training with focus on modern web technologies and team collaboration"
    },
    {
      title: "Team Leadership Recognition",
      organization: "Foodify Project Team",
      year: "2023",
      description: "Recognized for exceptional leadership as team motivator and UX/UI design lead in collaborative development projects"
    }
  ]
};

export default portfolioData;
