const Match = require("../db/models/match");
const Wrestler = require("../db/models/wrestler");

const allWrestlers = async ({ weightClass }) => {
  if (weightClass) {
  }
  const doc = await Wrestler.aggregate([
    {
      $match: {},
    },
  ]);
  return doc;
};
const totalSpecific = async technique => {
  const doc = await Match.aggregate([
    {
      $match: {},
    },
    {
      $project: { _id: "$scores.fullName", url: "$url", scores: "$scores" },
    },
    {
      $unwind: "$scores",
    },
    {
      $project: {
        _id: 0,

        scores: {
          $filter: {
            input: "$scores.takedowns",
            as: "td",
            cond: {
              $eq: ["$$td", technique],
            },
          },
        },
        url: "$url",
        takedowns: {
          $filter: {
            input: "$scores.totalScores",
            as: "sc",
            cond: {
              $eq: ["$$sc.takedown", technique],
            },
          },
        },
      },
    },

    { $unwind: { path: "$takedowns", preserveNullAndEmptyArrays: true } },

    {
      $group: {
        _id: "$takedowns.takedown",
        takedowns: { $push: { takedowns: "$takedowns", url: "$url" } },
      },
    },
    {
      $project: {
        takedowns: "$takedowns",
        number: { $size: "$takedowns" },
      },
    },
    {
      $sort: { number: -1 },
    },
  ]);
  return doc;
};

const totalTechnique = async () => {
  const doc = await Match.aggregate([
    {
      $match: {},
    },
    {
      $project: {
        url: 1,
        takedowns: "$scores",
      },
    },
    {
      $unwind: {
        path: "$takedowns",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "takedowns.takedown": {
          $ne: null,
        },
        "takedowns.offdef": "Offensive",
      },
    },
    {
      $group: {
        _id: "$takedowns.takedown",
        takedowns: {
          $push: {
            takedowns: "$takedowns",
            url: "$url",
          },
        },
      },
    },
    {
      $project: {
        takedowns: "$takedowns",
        number: {
          $size: "$takedowns",
        },
      },
    },
    {
      $sort: {
        number: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
  return doc;
};
const totalDefTechnique = async () => {
  const doc = await Match.aggregate([
    {
      $match: {},
    },
    {
      $project: {
        url: 1,
        takedowns: "$scores",
      },
    },
    {
      $unwind: {
        path: "$takedowns",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "takedowns.takedown": {
          $ne: null,
        },
        "takedowns.offdef": "Defensive",
      },
    },
    {
      $group: {
        _id: "$takedowns.takedown",
        takedowns: {
          $push: {
            takedowns: "$takedowns",
            url: "$url",
          },
        },
      },
    },
    {
      $project: {
        takedowns: "$takedowns",
        number: {
          $size: "$takedowns",
        },
      },
    },
    {
      $sort: {
        number: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
  return doc;
};
const totalSetup = async () => {
  const doc = await Match.aggregate([
    {
      $match: {},
    },
    {
      $project: {
        url: 1,
        takedowns: "$scores",
      },
    },
    {
      $unwind: {
        path: "$takedowns",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $unwind: {
        path: "$takedowns.setup",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$takedowns.setup",
        takedowns: {
          $push: {
            takedowns: "$takedowns",
            url: "$url",
          },
        },
      },
    },
    {
      $project: {
        takedowns: "$takedowns",
        number: {
          $size: "$takedowns",
        },
      },
    },
    {
      $sort: {
        number: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);
  return doc;
};

const wrestlerStats = async (id, sortParameter, direction) => {
  console.log(id);
  let match = {
    $match: {},
  };

  let sort = {
    $sort: {
      wins: 1,
    },
  };
  if (sortParameter) {
    let sort = {
      $sort: {
        [sortParameter]: direction,
      },
    };
  }

  if (id) {
    const idArray = id.map(id => {
      return { _id: id };
    });
    console.log(idArray);
    match = {
      $match: {
        $or: idArray,
      },
    };
  }

  const doc = await Wrestler.aggregate([
    {
      $project: {
        _id: {
          $toString: "$_id",
        },
        fullName: 1,
        lastName: 1,
        team: 1,
      },
    },
    match,
    {
      $lookup: {
        from: "matches",
        localField: "_id",
        foreignField: "redWrestler.id",
        as: "red",
      },
    },
    {
      $lookup: {
        from: "matches",
        localField: "_id",
        foreignField: "blueWrestler.id",
        as: "blue",
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        red: 1,
        blue: 1,
      },
    },
    {
      $unwind: {
        path: "$red",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $unwind: {
        path: "$blue",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        fullName: 1,
        matches: ["$red", "$blue"],
      },
    },
    {
      $unwind: {
        path: "$matches",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        fullName: 1,
        result: {
          $cond: [
            {
              $eq: ["$matches.result.winner", "$fullName"],
            },
            "winner",
            "loser",
          ],
        },
        type: {
          $cond: [
            {
              $eq: ["$matches.result.winner", "$fullName"],
            },
            "$matches.result.victoryType",
            "$matches.result.fullName",
          ],
        },
        wins: {
          $filter: {
            input: "$matches.scores",
            as: "sc",
            cond: {
              $and: [
                {
                  $eq: ["$$sc.fullName", "$fullName"],
                },
                {
                  $eq: ["$matches.result.winner", "$fullName"],
                },
              ],
            },
          },
        },
        losses: {
          $filter: {
            input: "$matches.scores",
            as: "sc",
            cond: {
              $and: [
                {
                  $eq: ["$$sc.fullName", "$fullName"],
                },
                {
                  $eq: ["$matches.result.loser", "$fullName"],
                },
              ],
            },
          },
        },
        lossOpponent: {
          $cond: [
            {
              $and: [
                {
                  $eq: ["$matches.result.loser", "$fullName"],
                },
              ],
            },
            "$matches.result.winner",
            null,
          ],
        },
        winOpponent: {
          $cond: [
            {
              $and: [
                {
                  $eq: ["$matches.result.winner", "$fullName"],
                },
              ],
            },
            "$matches.result.loser",
            null,
          ],
        },
        url: "$matches.ur",
      },
    },
    {
      $unwind: {
        path: "$wins",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$losses",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        totalScored: {
          $cond: [
            {
              $eq: ["$result", "winner"],
            },
            "$wins.total",
            "$losses.total",
          ],
        },
        matchLength: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $eq: ["$result", "winner"],
                    },
                    {
                      $or: [
                        {
                          $eq: ["$type", "VCA"],
                        },
                        {
                          $eq: ["$type", "VFA"],
                        },
                        {
                          $eq: ["$type", "VSU"],
                        },
                        {
                          $eq: ["$type", "VSU1"],
                        },
                      ],
                    },
                  ],
                },
                then: {
                  $arrayElemAt: ["$wins.totalScores", -1],
                },
              },
              {
                case: {
                  $eq: ["$result", "loser"],
                },
                then: null,
              },
              {
                case: {
                  $and: [
                    {
                      $eq: ["$result", "winner"],
                    },
                    {
                      $or: [
                        {
                          $eq: ["$type", "VPO"],
                        },
                        {
                          $eq: ["$type", "VPO1"],
                        },
                      ],
                    },
                  ],
                },
                then: {
                  $arrayElemAt: ["$wins.totalScores", -1],
                },
              },
              {
                case: {
                  $lt: [0, 5],
                },
                then: "",
              },
            ],
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        match: {
          result: "$result",
          type: "$type",
          wins: "$wins",
          losses: "$losses",
          lossOpponent: "$lossOpponent",
          winOpponent: "$winOpponent",
          totalScored: "$totalScored",
          matchLength: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [
                      {
                        $eq: ["$result", "winner"],
                      },
                      {
                        $or: [
                          {
                            $eq: ["$type", "VCA"],
                          },
                          {
                            $eq: ["$type", "VFA"],
                          },
                          {
                            $eq: ["$type", "VSU"],
                          },
                          {
                            $eq: ["$type", "VSU1"],
                          },
                        ],
                      },
                    ],
                  },
                  then: "$matchLength.time",
                },
                {
                  case: {
                    $eq: ["$result", "loser"],
                  },
                  then: null,
                },
                {
                  case: {
                    $and: [
                      {
                        $eq: ["$result", "winner"],
                      },
                      {
                        $or: [
                          {
                            $eq: ["$type", "VPO"],
                          },
                          {
                            $eq: ["$type", "VPO1"],
                          },
                        ],
                      },
                    ],
                  },
                  then: 360,
                },
                {
                  case: {
                    $lt: [0, 5],
                  },
                  then: "",
                },
              ],
            },
          },
          url: "$url",
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        fullName: {
          $addToSet: "$fullName",
        },
        matches: {
          $addToSet: "$match",
        },
      },
    },
    {
      $addFields: {
        lostMatches: {
          $filter: {
            input: "$matches",
            as: "match",
            cond: {
              $and: [
                {
                  $eq: ["$$match.result", "loser"],
                },
              ],
            },
          },
        },
        wonMatches: {
          $filter: {
            input: "$matches",
            as: "match",
            cond: {
              $eq: ["$$match.result", "winner"],
            },
          },
        },
        totalMatches: {
          $size: "$matches",
        },
      },
    },
    {
      $addFields: {
        wins: {
          $size: "$wonMatches",
        },
        losses: {
          $size: "$lostMatches",
        },
        opponentsBeat: {
          $map: {
            input: "$wonMatches",
            as: "match",
            in: "$$match.winOpponent",
          },
        },
        wonMatchLength: {
          $avg: "$wonMatches.matchLength",
        },
        opponentsLostTo: {
          $map: {
            input: "$lostMatches",
            as: "match",
            in: "$$match.lossOpponent",
          },
        },
      },
    },
    {
      $unwind: {
        path: "$fullName",
      },
    },
    sort,
  ]);
  return doc;
};
exports.wrestlerStats = wrestlerStats;
exports.allWrestlers = allWrestlers;
exports.totalDefTechnique = totalDefTechnique;
exports.totalTechnique = totalTechnique;
exports.totalSetup = totalSetup;
exports.totalSpecific = totalSpecific;
