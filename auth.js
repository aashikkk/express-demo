const authenticate = (req, res, next) => {
    console.log("Authenticating....");
    next(); // is used to pass the control to the next middleware function
};

export default authenticate;
