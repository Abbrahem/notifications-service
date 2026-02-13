function authenticateRequest(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized - Invalid API key' 
    });
  }
  
  next();
}

module.exports = { authenticateRequest };
