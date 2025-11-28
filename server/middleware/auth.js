import { clerkClient, getAuth } from "@clerk/express";


const protection = async (req, res, next) => {
    try {
        // Handle both Clerk v4 (req.auth is a function) and v5+ (req.auth is an object)
        const { userId } = getAuth(req);

        console.log('User Id:', userId, 'isAuthentication', authInfo);

        if (!userId) {
            return res.status(401).json({ success: false, message: 'No user ID found in authentication' });
        }

        const user = await clerkClient.users.getUser(userId);

        if (!user || user.privateMetadata.role !== 'admin') {
            console.log('You are not a valid admin');
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        console.log('You are authorized to access this resource');
        next();
    } catch (err) {
        console.log('Protection middleware error:', err);
        return res.status(500).json({ success: false, message: 'Some error in authorization to access this resource' });
    }
};

export default protection;