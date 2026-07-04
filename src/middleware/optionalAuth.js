import jwt from "jsonwebtoken";

// Ye middleware auth ko OPTIONAL banata hai.
// Agar token hai to req.user set ho jayega, agar nahi hai to bhi request chalti rahegi (guest view).
const optionalAuth = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return next(); // guest user, aage badho
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        // Invalid/expired token ho to bhi guest ki tarah treat karo, block mat karo
        next();
    }
};

export default optionalAuth;