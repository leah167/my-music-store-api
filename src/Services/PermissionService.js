const verifyUserLoggedIn = (req, res) => {
  if (!req.user) {
    res.status(401).send("User is not logged in");
    throw new Error("User is not logged in");
  }
};

const verifyUserIsAdmin = (req, res) => {
  verifyUserLoggedIn(req, res);
  if (!req.user.isAdmin) {
    res.status(403).send("Only accessible by an Admin");
    throw new Error("User is not an admin");
  }
};

const PermissionService = { verifyUserLoggedIn, verifyUserIsAdmin };

module.exports = PermissionService;
