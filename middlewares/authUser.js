import jwt from 'jsonwebtoken';

// User authentication middleware
const authUser = async (req, res, next) => {
    try {
        // Extract token from the request header (supports both "Bearer <token>" and "token" key)
        const token = req.headers.authorization?.split(" ")[1] || req.headers["token"];

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized, please log in again" });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
                }
                return res.status(403).json({ success: false, message: "Invalid token" });
            }

            // Attach userId to request body for further processing
            req.body.userId = decoded.id;
            next();
        });
    } catch (error) {
        console.log("JWT Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default authUser;
