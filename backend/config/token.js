import jwt from "jsonwebtoken";
const genToken = (id) => {
    try {
        const token =jwt.sign({ id }, process.env.JWT_SECRET, {   
            expiresIn: "1d",
        });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Error generating token");
    }
}
export default genToken;