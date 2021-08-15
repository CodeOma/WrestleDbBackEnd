const Team = require("../db/models/team");
const mongoose = require("mongoose");
const { createFilterOptions } = require("../helpers/helpers");
const teamMatches = async (id, filters, skip) => {
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
    const doc = await Team.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
          private: false,
        },
      },
      {
        $lookup: {
          from: "matches",
          localField: "teamName",
          foreignField: "redWrestler.team",
          as: "redMatches",
        },
      },
      {
        $lookup: {
          from: "matches",
          localField: "teamName",
          foreignField: "blueWrestler.team",
          as: "blueMatches",
        },
      },
      {
        $project: {
          teamName: 1,
          matches: ["$redMatches", "$blueMatches"],
        },
      },
      {
        $unwind: {
          path: "$matches",
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
          tournament: "$matches.tournament",
          style: "$matches.style",
          weightClass: "$matches.weightClass",
          round: "$matches.round",
          wrestler: {
            $cond: [
              {
                $eq: ["$matches.redWrestler.team", "$teamName"],
              },
              "$matches.redWrestler.id",
              "$matches.blueWrestler.id",
            ],
          },
          opponent: {
            $cond: [
              {
                $ne: ["$matches.redWrestler.team", "$teamName"],
              },
              "$matches.redWrestler.id",
              "$matches.blueWrestler.id",
            ],
          },
          scores: "$matches.scores",
          url: "$matches.url",
          result: "$matches.result",
        },
      },
      {
        $project: {
          teamName: 1,
          tournament: 1,
          style: 1,
          weightClass: 1,
          round: 1,
          wrestler: {
            $toObjectId: "$wrestler",
          },
          opponent: {
            $toObjectId: "$opponent",
          },
          scores: 1,
          url: 1,
          result: 1,
        },
      },
      {
        $lookup: {
          from: "wrestlers",
          localField: "wrestler",
          foreignField: "_id",
          as: "wrestler",
        },
      },
      {
        $lookup: {
          from: "wrestlers",
          localField: "opponent",
          foreignField: "_id",
          as: "opponent",
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
        $unwind: {
          path: "$wrestler",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$opponent",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          id: 1,
          teamName: 1,
          tournamentName: "$tournamentName.name",
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
          url: 1,
        },
      },
      filter,
      skipMatches,
    ]);

    const fields = await createFilterOptions(doc);
    console.log(fields);
    return { matches: doc.slice(0, 20), filters: fields };
  } catch (e) {
    console.log(e);
  }
};

exports.teamMatches = teamMatches;

// "_id": {
//   "$toObjectId": "$_id"
// }
