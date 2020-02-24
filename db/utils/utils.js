exports.formatDates = list => {
  const newArray = [...list];

  newArray.forEach(object => {
    const newDate = new Date(object.created_at);
    object.created_at = newDate;
  });
  return newArray;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
