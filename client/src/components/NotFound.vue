<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/" class="btn">Go Home</router-link>
    </div>
  </div>
</template>

<script>
export default { name: 'NotFound' };
</script>

<style scoped>
.not-found {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #f9fafb;
}

.content h1 {
  font-size: 7rem;
  font-weight: 700;
  color: #6366f1;
  margin: 0;
  line-height: 1;
}

.content h2 {
  font-size: 1.8rem;
  color: #1f2937;
  margin: 12px 0;
}

.content p {
  color: #6b7280;
  margin-bottom: 32px;
  font-size: 1.05rem;
}

.btn {
  display: inline-block;
  padding: 12px 28px;
  background: #6366f1;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
}

.btn:hover { background: #4f46e5; }
</style>
