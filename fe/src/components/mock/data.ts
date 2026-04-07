import { Users, Star, Target, Award } from "lucide-react";

export const navLinks = [
  { href: "#introduce", label: "Introduce" },
  { href: "#features", label: "Features" },
  { href: "#benefits", label: "Benefits" },
  { href: "#testimonials", label: "Testimonials" }
];

export const metrics = [
  {
    value: "500+",
    label: "Active Interns",
    color: "text-blue-600",
    icon: Users
  },
  {
    value: "150+",
    label: "Expert Mentors",
    color: "text-green-600",
    icon: Star
  },
  {
    value: "95%",
    label: "Success Rate",
    color: "text-purple-600",
    icon: Target
  },
  {
    value: "50+",
    label: "Organizations",
    color: "text-orange-600",
    icon: Award
  }
];

export const features = [
  {
    title: "Mentor-Intern Matching",
    description:
      "Intelligent matching system connects interns with experienced mentors based on skills, interests, and career goals.",
    icon: Users
  },
  {
    title: "Structured Training Plans",
    description:
      "Comprehensive learning paths with assignments, milestones, and skill assessments tailored to each field",
    icon: Target
  },
  {
    title: "Real-time Progress Tracking",
    description:
      "Monitor learning progress, assignment completion, and skill development with detailed analytics.",
    icon: Star
  },
  {
    title: "Assignment Management",
    description:
      "Create, assign, submit, and review assignments with feedback system and deadline tracking.",
    icon: Award
  },
  {
    title: "Communication Hub",
    description:
      "Built-in messaging, video calls, and collaboration tools for seamless mentor-intern interaction.",
    icon: Users
  },
  {
    title: "Performance Analytics",
    description:
      "Comprehensive reports and insights on intern performance, skill growth, and program effectiveness.",
    icon: Target
  }
];

export const benefits = [
  {
    title: "For Interns",
    items: [
      "Personalized learning paths",
      "Expert mentor guidance",
      "Real-world project experience",
      "Skill certification",
      "Career development support"
    ]
  },
  {
    title: "For Mentors",
    items: [
      "Streamlined intern management",
      "Progress tracking tools",
      "Assignment review system",
      "Performance analytics",
      "Recognition programs"
    ]
  },
  {
    title: "For Organizations",
    items: [
      "Structured internship programs",
      "Quality assurance",
      "Compliance tracking",
      "ROI measurement",
      "Talent pipeline development"
    ]
  }
];

export const testimonials = [
  {
    name: "Linh Tran",
    role: "Intern at TMA",
    quote:
      "InternHub helped me connect with amazing mentors and structure my learning effectively. I felt supported throughout the journey.",
    avatar: "/avatar1.webp"
  },
  {
    name: "David Nguyen",
    role: "Mentor at TMA",
    quote:
      "Managing interns has never been this efficient. The platform saves us hours every week and gives great visibility into progress.",
    avatar: "/avatar2.webp"
  },
  {
    name: "Anna Vu",
    role: "HR Manager",
    quote:
      "InternHub ensures a standardized training process across departments. It makes onboarding and performance tracking much easier.",
    avatar: "/avatar3.webp"
  }
];
