import jwt from 'jsonwebtoken'

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const adminToken = req.headers['admintoken']; 
        if(!adminToken){
            return res.json({ success: false, message: "Not Authorized login again (token not found)" })
        }
        const token_decode = jwt.verify(adminToken, process.env.JWT_SECRET);
        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({ success: false, message: "Not Authorized login again" })
        }

        next();
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })

    }
}

export default authAdmin;