exports.formatDates = list => {
  const newArray = list.map(obj => ({
    ...obj,
    created_at: new Date(obj.created_at)
  }));
  return newArray;
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(article => (refObj[article.title] = article.article_id));
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const newArray = comments.map(obj => ({ ...obj }));
  newArray.forEach(comment => {
    comment.author = comment.created_by;
    delete comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
  });
  return this.formatDates(newArray);
};
