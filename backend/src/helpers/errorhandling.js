const errorHandler = error => {
  let message = "";

  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (let errorName in error.errorors) {
      if (error.errorors[errorName].message)
        message = error.errorors[errorName].message;
    }
  }
  console.log(message);
  return message;
};

const timestampCheck = timestamp => {
  const {
    takedown,
    id,
    offdef,
    position,
    oppDefendedShot,
    type,
    videoTime,
    time,
    points,
  } = timestamp;
  if (!takedown || !takedown.length) {
    return res.status(400).json({
      error: "Takedown is required",
    });
  }
  if (!id || !id.length) {
    return res.status(400).json({
      error: "Something went wrong: Id error",
    });
  }
  if (!offdef || !offdef.length) {
    return res.status(400).json({
      error: "Takedown Category is required",
    });
  }
  if (!position || !position.length) {
    return res.status(400).json({
      error: "Position is required",
    });
  }
  if (!oppDefendedShot || !oppDefendedShot.length) {
    return res.status(400).json({
      error: "Defended Shot is required",
    });
  }
  if (!type || !type.length) {
    return res.status(400).json({
      error: "Type is required",
    });
  }
  if (!videoTime || !videoTime.length) {
    return res.status(400).json({
      error: "Video time is required",
    });
  }
  if (!time || !time.length) {
    return res.status(400).json({
      error: "Time is required",
    });
  }
  if (!points || !points.length) {
    return res.status(400).json({
      error: "Points is required",
    });
  }
};

const takedownCheck = td => {
  const { takedown, position, type, offdef } = td;
  if (!takedown || !takedown.length) {
    return res.status(400).json({
      error: "Takedown is required",
    });
  }
  if (!position || !position.length) {
    return res.status(400).json({
      error: "Position is required",
    });
  }
  if (!type || !type.length) {
    return res.status(400).json({
      error: "Type is required",
    });
  }
  if (!offdef || !offdef.length) {
    return res.status(400).json({
      error: "Category must be selected",
    });
  }
};

const tagCheck = tag => {
  if (!tag.tag || !tag.tag.length) {
    return res.status(400).json({
      error: "Tag is required",
    });
  }
};
const typeCheck = type => {
  if (!type.type || !type.type.length) {
    return res.status(400).json({
      error: "Type is required",
    });
  }
};
const positionCheck = position => {
  if (!position.position || !position.position.length) {
    return res.status(400).json({
      error: "Position is required",
    });
  }
};
const matchCheck = match => {
  const { tournament, style, result, redWrestler, blueWrestler, url } = match;
  if (!tournament || !tournament.length) {
    return res.status(400).json({
      error: "Tournament is required",
    });
  }
  if (!style || !style.length) {
    return res.status(400).json({
      error: "Style is required",
    });
  }
  if (!weightClass || !weightClass.length) {
    return res.status(400).json({
      error: "Weight Class is required",
    });
  }
  if (!round || !round.length) {
    return res.status(400).json({
      error: "Round is required",
    });
  }
  if (!result.victoryType || !result.victoryType.length) {
    return res.status(400).json({
      error: "Victory Type is required",
    });
  }
  if (!result.winner || !result.winner.length) {
    return res.status(400).json({
      error: "Winner is required",
    });
  }
  if (!result.loser || !result.loser.length) {
    return res.status(400).json({
      error: "Loser is required",
    });
  }
  // if (!result.winnerPoints || !result.winnerPoints.length) {
  //   return res.status(400).json({
  //     error: "Winneis required",
  //   });
  // }
  // if (!result.loserPoints || !result.loserPoints.length) {
  //   return res.status(400).json({
  //     error: "Position is required",
  //   });
  // }
  if (!result.redTotalPoints.length) {
    return res.status(400).json({
      error: "Red Total is required",
    });
  }
  if (!result.blueTotalPoints.length) {
    return res.status(400).json({
      error: "Blue Total Points is required",
    });
  }

  if (!redWrestler.id || !redWrestler.id.length) {
    return res.status(400).json({
      error: "Position is required",
    });
  }

  if (!blueWrestler.id || !blueWrestler.id.length) {
    return res.status(400).json({
      error: "Blue Wrestler is required",
    });
  }

  if (!url || !url.length) {
    return res.status(400).json({
      error: "Match Url is required",
    });
  }
};
exports.takedownCheck = takedownCheck;
exports.matchCheck = matchCheck;
exports.tagCheck = tagCheck;
exports.typeCheck = typeCheck;
exports.positionCheck = positionCheck;
exports.timestampCheck = timestampCheck;
exports.errorHandler = errorHandler;
