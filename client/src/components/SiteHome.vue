<template>
  <div class="home-container">
    <header>
      <h1>Ali Khademi Sullivan</h1>
      <p>London Ontario, Canada</p>
      <p>Studying at the University of Western Ontario - 4 year degree - Bachelors of Engineering Science (BESc.) - Software Engineering</p>

      <nav>
        <ul>
          <li><a href="https://www.linkedin.com/in/ali-khademi-sullivan-49930b24a/" target="_blank">LinkedIn</a></li>
          <li><a  href="https://github.com/alikhademisullivan" target="_blank">GitHub</a></li>
          <li><a target="_blank" href="http://localhost:5000/resumes/resume.pdf" download>Download Resume</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section class="intro">
        <h2>Welcome to My Portfolio</h2>
        <p>
          Hi, I'm [Your Name], a passionate [Your Profession]. This is my personal portfolio where you can learn more about me, my skills, and my projects.
        </p>
        <img src="@/assets/alikhademisullivan.jpg" alt="Ali Khademi Sullivan" class="profile-image" />

      </section>
      <section class="about">
        <h2>About Me</h2>
        <p>
          [Write a brief description about yourself, your background, and what you do. Highlight your skills, experiences, and any notable achievements.]
        </p>
      </section>
    </main>
    <footer>
      <p>© 2024 Ali Khademi Sullivan. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'SiteHome'
};
</script>

<style scoped>
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

.intro, .about {
  margin: 20px 0;
}

.intro h2, .about h2 {
  color: #1b5e20;
}

footer {
  background-color: #2e7d32;
  color: white;
  padding: 10px 0;
  position: relative; /* Change to relative */
  width: 100%;
  bottom: 0;
}
</style>

