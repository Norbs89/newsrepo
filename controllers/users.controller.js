const getUser = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username).then(res => {
    console.log("in the user controller");
  });
};

module.exports = getUser;
