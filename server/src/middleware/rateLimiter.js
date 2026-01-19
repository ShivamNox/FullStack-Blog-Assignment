 //Simple in-memory rate limiter
 // Redis-based solution
const requests = new Map();

const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests, please try again later.'
  } = options;

  // Clean up old entries every minute
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requests.entries()) {
      if (now - value.startTime > windowMs) {
        requests.delete(key);
      }
    }
  }, 60000);

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, startTime: now });
      return next();
    }

    const record = requests.get(ip);

    if (now - record.startTime > windowMs) {
      requests.set(ip, { count: 1, startTime: now });
      return next();
    }

    record.count++;

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    next();
  };
};

// Specific limiters for different routes
export const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts
  message: 'Too many login attempts, please try again after 15 minutes.'
});

export const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

export default rateLimiter;