exports.formatDates = list => {
  const newArray = [...list];

  newArray.forEach(object => {
    const newDate = new Date(object.created_at);
    object.created_at = newDate;
  });
  return newArray;
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(article => (refObj[article.title] = article.article_id));
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const newArray = [];
  comments.forEach(comment => {
    comment.author = comment.created_by;
    delete comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
    newArray.push(comment);
  });
  this.formatDates(newArray);
  return newArray;
};
