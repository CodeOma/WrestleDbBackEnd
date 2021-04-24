const Match = require("../db/models/match");
const { createFilterOptions } = require("../helpers/helpers");

const wrestlerTakedowns = async name => {
  const doc = await Match.aggregate([
    {
      $match: {
        $or: [
          { "redWrestler.fullName": name },
          { "blueWrestler.fullName": name },
        ],
      },
    },
    {
      $project: { _id: "$scores.fullName", scores: "$scores" },
    },
    {
      $unwind: "$scores",
    },
    {
      $project: {
        _id: {
          $filter: {
            input: "$_id",
            as: "id",
            cond: {
              $eq: ["$$id", name],
            },
          },
        },
        opponentsBeat: {
          $map: {
            input: "$wonMatches",
            as: "match",
            in: "$$match.lossOpponent",
          },
        },

        takedowns: {
          $filter: {
            input: "$scores.totalScores",
            as: "sc",
            cond: {
              $eq: ["$$sc.name", name],
            },
          },
        },
      },
    },

    { $unwind: { path: "$takedowns", preserveNullAndEmptyArrays: false } },

    {
      $group: {
        _id: "$_id",
        takedowns: { $push: "$takedowns" },
      },
    },
  ]);
  console.log(doc);
  return doc;
};

const wrestlerConceded = async name => {
  const doc = await Match.aggregate([
    {
      $match: {
        $or: [
          { "redWrestler.fullName": name },
          { "blueWrestler.fullName": name },
        ],
      },
    },
    {
      $project: { _id: "$scores.fullName", scores: "$scores" },
    },
    {
      $unwind: "$scores",
    },
    {
      $project: {
        _id: {
          $filter: {
            input: "$_id",
            as: "id",
            cond: {
              $ne: ["$$id", name],
            },
          },
        },
        takedowns: {
          $filter: {
            input: "$scores.totalScores",
            as: "sc",
            cond: {
              $ne: ["$$sc.name", name],
            },
          },
        },
      },
    },

    { $unwind: { path: "$takedowns", preserveNullAndEmptyArrays: false } },

    {
      $group: {
        _id: "$_id",
        takedowns: { $push: "$takedowns" },
      },
    },
  ]);
  console.log(doc);
  return doc;
};
const takedownsConceded = async name => {
  const doc = await Match.aggregate([
    {
      $match: {
        $or: [
          { "redWrestler.fullName": name },
          { "blueWrestler.fullName": name },
        ],
      },
    },
    {
      $project: { _id: "$scores.fullName", scores: "$scores" },
    },
    {
      $unwind: "$scores",
    },
    {
      $project: {
        takedowns: {
          $filter: {
            input: "$scores.totalScores",
            as: "sc",
            cond: {
              $ne: ["$$sc.name", name],
            },
          },
        },
      },
    },

    { $unwind: { path: "$takedowns", preserveNullAndEmptyArrays: false } },

    {
      $group: {
        _id: null,
        takedowns: { $push: "$takedowns" },
      },
    },
    {
      $project: {
        takedowns: "$takedowns",
        takedownsGivenUp: { $size: "$takedowns" },
      },
    },
  ]);
  console.log(doc);
  return doc;
};

const scoring = async name => {
  const doc = await Match.aggregate([
    {
      $match: {
        $or: [
          { "redWrestler.fullName": name },
          { "blueWrestler.fullName": name },
        ],
      },
    },
    {
      $project: { _id: "$scores.fullName", url: "$url", scores: "$scores" },
    },
    {
      $unwind: "$scores",
    },
    {
      $project: {
        _id: {
          $filter: {
            input: "$_id",
            as: "id",
            cond: {
              $eq: ["$$id", name],
            },
          },
        },

        url: "$url",
        takedowns: {
          $filter: {
            input: "$scores.totalScores",
            as: "sc",
            cond: {
              $eq: ["$$sc.name", name],
            },
          },
        },
      },
    },

    { $unwind: { path: "$takedowns", preserveNullAndEmptyArrays: false } },

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
        // offense: {
        // $size: { $eq: ["$takedowns.takedown.offdef", "Offensive"] },
        // },
      },
    },
    {
      $sort: { number: -1 },
    },
  ]);
  return doc;
};
const conceded = async name => {
  const doc = await Match.aggregate([
    {
      $match: {
        $or: [
          { "redWrestler.fullName": name },
          { "blueWrestler.fullName": name },
        ],
      },
    },
    {
      $project: { _id: "$scores.fullName", url: "$url", scores: "$scores" },
    },
    {
      $unwind: "$scores",
    },
    {
      $project: {
        _id: {
          $filter: {
            input: "$_id",
            as: "id",
            cond: {
              $ne: ["$$id", name],
            },
          },
        },
        url: "$url",

        takedowns: {
          $filter: {
            input: "$scores.totalScores",
            as: "sc",
            cond: {
              $ne: ["$$sc.name", name],
            },
          },
        },
      },
    },

    { $unwind: { path: "$takedowns", preserveNullAndEmptyArrays: false } },

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
  console.log(doc);
  return doc;
};
const gotCountered = async name => {
  const doc = await Match.aggregate([
    {
      $match: {
        $or: [
          { "redWrestler.fullName": name },
          { "blueWrestler.fullName": name },
        ],
      },
    },
    {
      $project: { _id: "$scores.fullName", url: "$url", scores: "$scores" },
    },
    {
      $unwind: "$scores",
    },
    {
      $project: {
        _id: {
          $filter: {
            input: "$_id",
            as: "id",
            cond: {
              $ne: ["$$id", name],
            },
          },
        },
        url: "$url",

        takedowns: {
          $filter: {
            input: "$scores.totalScores",
            as: "sc",
            cond: {
              $ne: ["$$sc.name", name],
              // $ne: ["$$sc.name", name],
            },
          },
        },
      },
    },

    { $unwind: { path: "$takedowns", preserveNullAndEmptyArrays: false } },

    {
      $group: {
        _id: { offdef: "$takedowns.offdef", name: "$takedowns.name" },
        takedowns: { $push: { takedowns: "$takedowns", url: "$url" } },
      },
    },

    // {
    //   $sort: { takedowns: -1 },
    // },
  ]);
  console.log(doc);
  return doc;
};

const getScoreTypes = async name => {
  const doc = await Match.aggregate([
    {
      $match: {
        $or: [
          { "redWrestler.fullName": name },
          { "blueWrestler.fullName": name },
        ],
      },
    },
    {
      $project: { _id: "$scores.fullName", url: "$url", scores: "$scores" },
    },
    {
      $unwind: "$scores",
    },
    {
      $project: {
        _id: {
          $filter: {
            input: "$_id",
            as: "id",
            cond: {
              $eq: ["$$id", name],
            },
          },
        },
        url: "$url",
        takedowns: {
          $filter: {
            input: "$scores.totalScores",
            as: "sc",
            cond: {
              $eq: ["$$sc.name", name],
            },
          },
        },
      },
    },

    { $unwind: { path: "$takedowns", preserveNullAndEmptyArrays: false } },

    {
      $group: {
        _id: "$takedowns.type",
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

const setups = async name => {
  const doc = await Match.aggregate([
    {
      $match: {
        $or: [
          { "redWrestler.fullName": name },
          { "blueWrestler.fullName": name },
        ],
      },
      $project: {
        _id: "$scores.fullName",
        url: "$url",
        scores: {
          $filter: {
            input: "$scores.totalScores",
            as: "sc",
            cond: {
              $ne: ["$$sc.takedown", []],
            },
          },
        },
      },
    },
    {
      $unwind: "$scores",
    },

    {
      $project: {
        _id: 0,
        url: "$url",
        takedowns: "$scores",
      },
    },

    { $unwind: { path: "$takedowns", preserveNullAndEmptyArrays: false } },
    {
      $unwind: { path: "$takedowns.setup", preserveNullAndEmptyArrays: false },
    },

    {
      $group: {
        _id: "$takedowns.setup",
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

const wrestlerMatches = async (id, filters, skip) => {
  try {
    let skipMatches = {
      $skip: parseInt(skip),
    };
    // {
    //   wrestlerResult:"lost"
    // }
    let filter = {
      $match: {},
    };
    if (filters) {
      console.log("filters");

      const filt = Object.entries(JSON.parse(filters))
        .map(([key, arr]) => {
          if (arr.length >= 1) {
            if (key === "weightClass") {
              const filterItem = arr.map(filter => {
                return { weightClass: filter };
              });
              return { $or: filterItem };
            }
            if (key === "tournament") {
              const filterItem = arr.map(filter => {
                return { tournamentName: filter };
              });

              return { $or: filterItem };
            }
            if (key === "team") {
              const filterItem = arr.map(filter => {
                return { "opponent.team": filter };
              });

              return { $or: filterItem };
            }
            if (key === "opponent") {
              const filterItem = arr.map(filter => {
                return { "opponent.fullName": filter };
              });

              return { $or: filterItem };
            }
            if (key === "round") {
              const filterItem = arr.map(filter => {
                return { round: filter };
              });

              return { $or: filterItem };
            }
            if (key === "result") {
              const filterItem = arr.map(filter => {
                return { "result.victoryType": filter };
              });

              return { $or: filterItem };
            }
            if (key === "winLoss") {
              const filterItem = arr.map(filter => {
                return { wrestlerResult: filter };
              });

              return { $or: filterItem };
            }
          } else {
          }
        })
        .filter(item => item !== undefined);
      if (filt !== []) {
        filter = {
          $match: {
            $and: [{ "wrestler.id": id }, ...filt],
          },
        };
      }
    }

    const doc = await Match.aggregate([
      {
        $match: {
          $or: [
            {
              "redWrestler.id": id,
            },
            {
              "blueWrestler.id": id,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "tournaments",
          localField: "tournament",
          foreignField: "_id",
          as: "tournamentName",
        },
      },
      {
        $unwind: {
          path: "$tournamentName",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          id: 1,
          tournamentName: "$tournamentName.name",
          style: 1,
          round: 1,
          weightClass: 1,

          wrestler: {
            $cond: [
              {
                $eq: ["$redWrestler.id", id],
              },
              "$redWrestler",
              "$blueWrestler",
            ],
          },
          opponent: {
            $cond: [
              {
                $ne: ["$redWrestler.id", id],
              },
              "$redWrestler",
              "$blueWrestler",
            ],
          },
          scores: 1,
          url: 1,
          result: 1,
        },
      },
      {
        $project: {
          id: 1,
          tournamentName: 1,
          style: 1,
          round: 1,
          wrestler: {
            $cond: [
              {
                $eq: ["$redWrestler.id", id],
              },
              "$redWrestler",
              "$blueWrestler",
            ],
          },
          opponent: {
            $cond: [
              {
                $ne: ["$redWrestler.id", id],
              },
              "$redWrestler",
              "$blueWrestler",
            ],
          },
          wrestler: 1,
          opponent: 1,
          weightClass: 1,

          // scores: 1,
          url: 1,
          result: 1,
          wrestlerResult: {
            $cond: [
              { $eq: ["$wrestler.fullName", "$result.winner"] },
              "won",
              "lost",
            ],
          },

          wrestlerScores: {
            $filter: {
              input: "$scores",
              as: "sc",
              cond: {
                $eq: ["$$sc.fullName", "$wrestler.fullName"],
              },
            },
          },
          opponentScores: {
            $filter: {
              input: "$scores",
              as: "sc",
              cond: {
                $ne: ["$$sc.fullName", "$wrestler.fullName"],
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$wrestlerScores",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$opponentScores",
          preserveNullAndEmptyArrays: true,
        },
      },

      filter,
      skipMatches,
    ]);
    const fields = await createFilterOptions(doc);
    return { matches: doc.slice(0, 20), filters: fields };
  } catch (error) {
    console.log(error);
  }
};

exports.wrestlerMatches = wrestlerMatches;
exports.gotCountered = gotCountered;
exports.getScoreTypes = getScoreTypes;
exports.scoring = scoring;
exports.conceded = conceded;
exports.setups = setups;

exports.wrestlerTakedowns = wrestlerTakedowns;
exports.wrestlerConceded = wrestlerConceded;
exports.takedownsConceded = takedownsConceded;
///
//all takedowns
[
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
      redsize: {
        $size: "$red",
      },
      bluesize: {
        $size: "$blue.scores",
      },
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
    $unwind: {
      path: "$blue.scores",
      preserveNullAndEmptyArrays: false,
    },
  },
  {
    $unwind: {
      path: "$red.scores",
      preserveNullAndEmptyArrays: false,
    },
  },

  {
    $project: {
      _id: "$fullName",
      scores: ["$blue.scores.totalScores", "$red.scores.totalScores"],
    },
  },
];

// result:{ $cond: [{"$and":[{$eq: ["$red.scores[0].fullName", "$fullName"]}, {$eq: ["$fullName", "$red.result.winner"]}] },
//         'ok',
//       'not' ]} ,

// result:{
//   $cond:[
//   {'$or':[{$eq: ["$red.result.winner", "$fullName"]}, {$eq: ["$blue.result.winner", "$fullName"]}]},
//         'winner',
//       'loser']}
