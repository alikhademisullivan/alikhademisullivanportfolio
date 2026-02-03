<template>
  <div class="home-container">
    <header>
      <h1>Ali Khademi Sullivan</h1>
      <p>Ontario, Canada</p>
      <p>Student at the University of Western Ontario </p>

      <nav>
        <ul>
          <li><a href="https://www.linkedin.com/in/ali-khademi-sullivan-49930b24a/" target="_blank"><i class="fab fa-linkedin" title="LinkedIn"></i></a></li>
          <li><a  href="https://github.com/alikhademisullivan" target="_blank"><i title="Github" class="fab fa-github"></i></a></li>
          <li><a target="_blank" :href="resumeLink" @click.prevent="fetchResumeLink" download><i title="Resume" class="fas fa-file-alt"></i></a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section class="intro">
        <h2>Welcome to My Portfolio</h2>
        <p>
          Hi, I'm Ali Khademi Sullivan, a passionate student studying Software Engineering at the University of Western Ontario. 
        </p>
        <p>   
          This is my personal portfolio where you can learn more about me, my skills, work experience, and projects.
        </p>
        <img src="@/assets/alikhademisullivan.jpg" alt="Ali Khademi Sullivan" class="profile-image" />
      </section>
      <section class="about">
  <h2>About Me</h2>
  <p>
    Hello! I'm Ali Khademi Sullivan, a dedicated and passionate software engineering student at the University of Western Ontario. Currently entering the final year of my four-year Bachelor of Engineering Science (BESc.) program, I have developed a strong foundation in various programming languages and software development methodologies.
  </p>
  <p>
    Throughout my academic journey, I have gained proficiency in Java, JavaScript, React, HTML, Python, and many other technologies. My experience includes working as a Student Software Developer at Bell Canada, where I collaborated with a team to develop and maintain web applications, utilizing tools such as ASP.NET, Microsoft SQL Server, and Visual Studio.
  </p>
  <p>
    I am committed to continuous learning and professional growth, always eager to explore new programming paradigms and technologies. My goal is to leverage my skills and knowledge to contribute to innovative projects and make a positive impact in the field of software engineering.
  </p>
  <p>
    Outside of my academic and professional pursuits, I enjoy working on personal projects, exploring new technologies, and staying updated with the latest industry trends. I am excited to continue my journey in software engineering and look forward to the opportunities and challenges that lie ahead.
  </p>
</section>
      <section class="education">
        <h2>Education</h2>
        <img src="@/assets/westernlogo2.png" alt="School Logo" class="school-logo" />
        <p><strong>University of Western Ontario</strong></p>
        <p>Bachelor of Engineering Science (BESc.) - Software Engineering</p>
        <p>Entering final year of 4 year program</p>
        <p>Participated in Co-op program - Gained 12 months of Software Engineering work experience</p>
        <p>Expected Graduation: 2026</p>
      </section>

      <section class="skills">
        <h2>Skills</h2>
        <div class="skills-container">
          <span v-for="skill in distinctSkills" :key="skill" class="skill-badge">{{ skill }}</span>
        </div>
      </section>
    </main>
    
  </div>
</template>

<script>
import AuthService from '../services/AuthService';
import ExperienceService from '../services/ExperienceService';

export default {
  data() {
    return {
      experiences: [],
      distinctSkills: [],
      resumeLink: '#'
    };
  },
  methods: {
    async fetchExperiences() {
      try {
        const response = await ExperienceService.getAllExperiencies();
        this.experiences = response.data;
        console.log(this.experiences);

        this.computeDistinctSkills();
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    },
    computeDistinctSkills() {
      const allSkills = this.experiences.flatMap(experience => experience.skills);
      this.distinctSkills = [...new Set(allSkills)];
      console.log(this.distinctSkills);
    },
    async fetchResumeLink() {
      const resume = 'resume.pdf'; // Replace with the actual resume identifier
      const url = await this.getResume(resume);
      if (url) {
        this.resumeLink = url;
        window.location.href = url; // Redirect to the URL

      }
      console.log(url);
    },
    async getResume(Resume) {
      try {
        const response = await AuthService.getResume(Resume);
        return response; // Assuming the response contains the URL
      } catch (error) {
        console.error('Failed to get resume:', error);
      }
    },
   
 

  },
  async mounted() {
    await this.fetchExperiences();
  },
  name: 'SiteHome'
};
</script>

<style scoped>


.skills {
    margin-top: 20px;
    text-align: center;
  }

  .skills h2 {
    color: #004d40; /* Dark green heading */
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    margin-bottom: 10px;
    text-align: center;
  }

  .skills-container {
    display: flex;
    justify-content: center; /* Center items horizontally */
    flex-wrap: wrap;
    gap: 10px;
  }

  .skill-badge {
    background-color: #e0f7e9; /* Light green background */
    border: 2px solid #004d40; /* Dark green border */
    border-radius: 5px;
    color: #004d40; /* Dark green text */
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    padding: 5px 10px;
    transition: transform 0.2s ease-in-out;
    display: inline-block;
    text-align: center; /* Center text in badges */
    width: calc(12.5% - 20px); /* Adjust width to fit 8 items per line, accounting for gap */
  }

  .skill-badge:hover {
    transform: scale(1.05); /* Slightly enlarge on hover */
  }


.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-top: 20px;
}
body {
  font-family: Arial, sans-serif;
  background-color: #f0f4f8;
  margin: 0;
  padding: 0;
}

.home-container {
  text-align: center;
  color: #2e7d32;
}

header {
  background-color: #2e7d32;
  color: white;
  padding: 20px 0;
}

header h1 {
  margin: 0;
  font-size: 36px;
}

nav ul {
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0 0;
  display: flex;
  justify-content: center;
}
.about p {
  max-width: 1000px; /* Set the maximum width for paragraphs */
  margin: 15px auto; /* Center the paragraphs */
}
nav ul li {
  margin: 0 15px;
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

nav ul li a:hover {
  text-decoration: underline;
}

main {
  padding: 20px;
}

.intro, .about, .education {
  margin: 20px 0;
}

.intro h2, .about h2, .education h2 {
  color: #1b5e20;
}

.school-logo {
  width: 100px;
  height: auto;
  margin: 10px 0;
}


</style>
