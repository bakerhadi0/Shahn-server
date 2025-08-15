import jwt from "jsonwebtoken";
export function requireAuth(req,res,next){
  try{
    const h=req.headers.authorization||"";
    const token=h.startsWith("Bearer ")?h.slice(7):null;
    if(!token) return res.status(401).json({message:"Unauthorized"});
    const data=jwt.verify(token,process.env.JWT_SECRET||"dev_secret");
    req.user=data; next();
  }catch{ res.status(401).json({message:"Unauthorized"}); }
}
export function permit(...roles){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).json({message:"Unauthorized"});
    if(roles.length && !roles.includes(req.user.role)) return res.status(403).json({message:"Forbidden"});
    next();
  };
}
