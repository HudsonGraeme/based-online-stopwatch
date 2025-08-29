import { useEffect } from "react";
import { useLocation } from "react-router";

const StructuredData = () => {
  const location = useLocation();

  useEffect(() => {
    const existingScript = document.querySelector("#structured-data");
    if (existingScript) {
      existingScript.remove();
    }

    let structuredData;

    if (location.pathname === "/") {
      // Homepage - SoftwareApplication schema
      structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Based Online Stopwatch",
        description:
          "Free online stopwatch, countdown timer, and time tracking tools. Perfect for classrooms, presentations, races, and productivity.",
        url: "https://based-online-stopwatch.com",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Online Stopwatch",
          "Countdown Timer",
          "Race Timers",
          "Classroom Timers",
          "Exam Timers",
          "Presentation Timers",
          "Random Name Picker",
          "Random Number Generator",
          "Tally Counters",
        ],
      };
    } else if (location.pathname === "/countdown") {
      // Countdown page
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Countdown Timer - Based Online Stopwatch",
        description:
          "Free online countdown timer. Perfect for presentations, cooking, studying, and time management.",
        url: "https://based-online-stopwatch.com/countdown",
        applicationCategory: "UtilitiesApplication",
        browserRequirements: "Requires JavaScript",
      };
    } else if (location.pathname === "/classroom-timers") {
      // Classroom timers
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Classroom Timer - Based Online Stopwatch",
        description:
          "Free classroom timer for teachers and educators. Manage classroom activities and lessons with ease.",
        url: "https://based-online-stopwatch.com/classroom-timers",
        applicationCategory: "EducationalApplication",
        browserRequirements: "Requires JavaScript",
      };
    } else if (location.pathname === "/exam-timers") {
      // Exam timers
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Exam Timer - Based Online Stopwatch",
        description:
          "Free exam timer for students and educators. Perfect for timed tests and assessments.",
        url: "https://based-online-stopwatch.com/exam-timers",
        applicationCategory: "EducationalApplication",
        browserRequirements: "Requires JavaScript",
      };
    } else {
      // Generic page schema
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Based Online Stopwatch",
        description: "Free online timer and stopwatch tools",
        url: `https://based-online-stopwatch.com${location.pathname}`,
        isPartOf: {
          "@type": "WebSite",
          name: "Based Online Stopwatch",
          url: "https://based-online-stopwatch.com",
        },
      };
    }

    const script = document.createElement("script");
    script.id = "structured-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector("#structured-data");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [location.pathname]);

  return null;
};

export default StructuredData;
