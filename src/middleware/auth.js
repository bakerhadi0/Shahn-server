import jwt from "jsonwebtoken";
export default function requireAuth(req,res,next){
  const h=req.headers.authorization||"";
  const t=h.startsWith("Bearer ")?h.slice(7):null;
  if(!t) return res.status(401).json({message:"Unauthorized"});
  try{ req.user=jwt.verify(t, process.env.JWT_SECRET||"secret"); next(); }
  catch(e){ return res.status(401).json({message:"Unauthorized"}); }
}