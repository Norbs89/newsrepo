const getAllTopics = (req, res, next) => {
  fetchAllTopics().then(res => {
    console.log("in the controller");
  });
};

module.exports = getAllTopics;
