const pathFinder = async (req, res, next)=>{
    var {location} = req.params;
    
    console.log(location);
    req.location = location;
    console.log(req.location);
    next();
}

export default pathFinder;