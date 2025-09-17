// client/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = q('#registerForm');
  const loginForm = q('#loginForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = q('#name').value.trim();
      const email = q('#email').value.trim();
      const password = q('#password').value;
      try {
        const data = await apiPost('/auth/register', { name, email, password });
        localStorage.setItem('token', data.accessToken || data.token || data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user || {}));
        window.location.href = 'dashboard.html';
      } catch (err) {
        q('#registerError').textContent = err.message;
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = q('#loginEmail').value.trim();
      const password = q('#loginPassword').value;
      try {
        const data = await apiPost('/auth/login', { email, password });
        localStorage.setItem('token', data.accessToken || data.token || data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user || {}));
        window.location.href = 'dashboard.html';
      } catch (err) {
        q('#loginError').textContent = err.message;
      }
    });
  }
});
