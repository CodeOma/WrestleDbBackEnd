const Tournament = require("../db/models/tournament");
const mongoose = require("mongoose");
const { createFilterOptions } = require("../helpers/helpers");

const tournamentMatches = async (id, filters, skip) => {
  try {
    let skipMatches = {
      $skip: parseInt(skip),
    };

    let filter = {
      $match: {},
    };
    if (filters) {
      console.log("filters");
      console.log(id);
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
            $and: [{ _id: mongoose.Types.ObjectId(id) }, ...filt],
          },
        };
      }
    }
    const doc = await Tournament.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "matches",
          localField: "_id",
          foreignField: "tournament",
          as: "matches",
        },
      },
      {
        $unwind: {
          path: "$matches",
        },
      },
      {
        $project: {
          teamName: 1,
          tournamentName: "$name",
          style: "$matches.style",
          weightClass: "$matches.weightClass",
          round: "$matches.round",
          wrestler: {
            $cond: [
              {
                $eq: ["$matches.redWrestler.team", "$teamName"],
              },
              "$matches.redWrestler",
              "$matches.blueWrestler",
            ],
          },
          opponent: {
            $cond: [
              {
                $ne: ["$matches.redWrestler.team", "$teamName"],
              },
              "$matches.redWrestler",
              "$matches.blueWrestler",
            ],
          },
          scores: "$matches.scores",
          url: "$matches.url",
          result: "$matches.result",
        },
      },
      {
        $project: {
          id: 1,
          teamName: 1,
          tournamentName: 1,
          style: 1,
          round: 1,
          weightClass: 1,
          result: 1,
          wrestler: 1,
          opponent: 1,
          wrestlerResult: {
            $cond: [
              {
                $eq: ["$wrestler.fullName", "$result.winner"],
              },
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
          url: 1,
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
      // filter,
      // skipMatches,
    ]);

    const fields = await createFilterOptions(doc);
    return { matches: doc.slice(0, 20), filters: fields };
  } catch (e) {
    console.log(e);
  }
};
exports.tournamentMatches = tournamentMatches;
