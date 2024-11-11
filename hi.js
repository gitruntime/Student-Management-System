const prompt = {
  student: {
    id: "S12345",
    name: "Thouseef Hamza ",
    age: 17,
    gender: "Male",
    grade_level: "12th Grade",
    interests: [
      "Mathematics",
      "Technology",
      "Robotics",
      "Computer Science",
      "Gaming",
    ],
    academic_performance: {
      subjects: {
        maths: {
          score: 95,
          grade: "A+",
        },
        technology: {
          score: 98,
          grade: "A+",
        },
        physics: {
          score: 90,
          grade: "A",
        },
        chemistry: {
          score: 85,
          grade: "A",
        },
        biology: {
          score: 70,
          grade: "C",
        },
        english: {
          score: 88,
          grade: "B+",
        },
        history: {
          score: 92,
          grade: "A",
        },
        computer_science: {
          score: 96,
          grade: "A+",
        },
      },
      attendance: "Excellent",
      overall_grade: "A+",
      scholarship: {
        awarded: true,
        subject: "Technology",
        grade: "A",
      },
    },
    extracurricular_activities: [
      {
        activity: "Robotics Club",
        position: "Member",
        achievements: [
          "First Place at Regional Robotics Competition",
          "Participated in National Robotics Championship",
        ],
      },
      {
        activity: "Mathletes",
        position: "Captain",
        achievements: [
          "State Championship Winner",
          "Qualified for National Math Olympiad",
        ],
      },
      {
        activity: "Coding Bootcamp",
        position: "Participant",
        achievements: [
          "Developed a mobile app for school project",
          "Won Best Project Award",
        ],
      },
      {
        activity: "School Newspaper",
        position: "Tech Columnist",
        achievements: ["Wrote articles on latest tech trends and innovations"],
      },
    ],
    health: {
      physical: "Excellent",
      mental: "Excellent",
      fitness_activities: ["Swimming", "Running", "Yoga"],
    },
    demographics: {
      ethnicity: "Asian",
      language: "English",
      location: "New York, USA",
      family_background: {
        siblings: [
          {
            name: "Emily Doe",
            age: 14,
            interests: ["Arts", "Sports"],
          },
        ],
        family_income: "Upper Middle Class",
      },
    },
    goals: {
      short_term: [
        "Improve coding skills",
        "Participate in science fairs",
        "Join an internship program",
      ],
      long_term: [
        "Pursue a degree in Computer Science",
        "Work in artificial intelligence",
        "Start a tech company",
      ],
    },
    personality_traits: [
      "Curious",
      "Analytical",
      "Creative",
      "Motivated",
      "Collaborative",
    ],
    parental_info: {
      father: {
        name: "Michael Doe",
        occupation: "Engineer",
        education: "Master's in Engineering",
      },
      mother: {
        name: "Jane Doe",
        occupation: "Teacher",
        education: "Bachelor's in Education",
      },
    },
    scholarships_awarded: [
      {
        name: "Technology Excellence Scholarship",
        amount: 2000,
        year_awarded: 2023,
      },
      {
        name: "STEM Achievement Grant",
        amount: 1500,
        year_awarded: 2022,
      },
    ],
    volunteer_experience: [
      {
        organization: "Local Community Center",
        role: "Volunteer Tutor",
        duration: "1 year",
        impact: "Tutored underprivileged children in math and science",
      },
      {
        organization: "Tech for Good",
        role: "Volunteer Developer",
        duration: "6 months",
        impact: "Developed website for non-profit organization",
      },
    ],
  },
  summary: {
    description:
      "Thouseef Hamza  is a dedicated student with a strong passion for mathematics and technology. He consistently excels in his studies, particularly in math and technology-related subjects, while demonstrating less interest in biology. His excellent physical and mental health, along with perfect attendance, highlights his commitment to academic success.",
    achievements:
      "Thouseef   has won multiple scholarships, including the prestigious Technology Excellence Scholarship, recognizing his outstanding performance in technology. He actively participates in extracurricular activities that further enhance his skills and knowledge.",
    aspirations:
      "Thouseef   aims to pursue a degree in Computer Science, with long-term goals of working in artificial intelligence and eventually starting his own tech company. His drive, curiosity, and analytical mindset make him a standout student ready to take on future challenges.",
  },
};
const thousi = async () => {
  const result = await model.generateContent(
    `${JSON.stringify(prompt)} Based on the student's interests and outstanding academic performance, what potential career paths could lead to success?`,
  );
  console.log(result.response.text());
};
thousi();
