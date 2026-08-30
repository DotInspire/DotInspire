import app from './app';
import { config } from './config/env';

const PORT = config.port;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 Dot Inspire Backend API running`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${config.env}`);
    console.log(`=================================`);
  });
}

export default app;
