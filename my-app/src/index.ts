import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth'

const app = new Hono();

app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: 'secret',
  })
)

app.get('/admin', (c) => {
  return c.text('You are authorized!')
})
// store user data in memory
const users: { username: string; password: string }[] = [];

// Signup route
app.post('/signup', async (c) => {
  const { username, password } = await c.req.json();
  if (users.find(user => user.username === username)) {
    return c.json({ message: 'User already exists' }, 400);
  }
  users.push({ username, password });
  return c.json({ message: 'Signup successful' });
});

// Login route
app.post('/login', async (c) => {
  const { username, password } = await c.req.json();
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return c.json({ message: 'Invalid username or password' }, 401);
  }
  return c.json({ message: 'Login successful' });
});

// Default route
app.get('/', (c) => {
  return c.json({ message: 'Welcome' });
});

export default app
