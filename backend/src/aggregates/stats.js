const Wrestler = require("../db/models/wrestler");
const mongoose = require("mongoose");

const generalStats = async (id, sortParameter, direction) => {
  const doc = await Wrestler.aggregate([
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
        tournamentName: "$tournament.name",
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
        oppScores: {
          $filter: {
            input: "$matches.scores",
            as: "sc",
            cond: {
              $and: [
                {
                  $ne: ["$$sc.fullName", "$fullName"],
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
      $unwind: {
        path: "$oppScores",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$tournamentName",
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
      },
    },
    {
      $project: {
        fullName: 1,
        match: {
          result: "$result",
          type: "$type",
          pointsScored: {
            $cond: ["$wins", "$wins", "$losses"],
          },
          lossOpponent: "$lossOpponent",
          winOpponent: "$winOpponent",
          totalScored: "$totalScored",
          oppScores: "$oppScores",
          // matchLength: {
          //   $switch: {
          //     branches: [
          //       {
          //         case: {
          //           $and: [
          //             {
          //               $eq: ["$result", "winner"],
          //             },
          //             {
          //               $or: [
          //                 {
          //                   $eq: ["$type", "VCA"],
          //                 },
          //                 {
          //                   $eq: ["$type", "VFA"],
          //                 },
          //                 {
          //                   $eq: ["$type", "VSU"],
          //                 },
          //                 {
          //                   $eq: ["$type", "VSU1"],
          //                 },
          //               ],
          //             },
          //           ],
          //         },
          //         then: "$matchLength.time",
          //       },
          //       {
          //         case: {
          //           $and: [
          //             {
          //               $eq: ["$result", "winner"],
          //             },
          //             {
          //               $or: [
          //                 {
          //                   $eq: ["$type", "VPO"],
          //                 },
          //                 {
          //                   $eq: ["$type", "VPO1"],
          //                 },
          //               ],
          //             },
          //           ],
          //         },
          //         then: 360,
          //       },
          //       {
          //         case: {
          //           $lt: [0, 5],
          //         },
          //         then: "",
          //       },
          //     ],
          //   },
          // },
          url: "$url",
        },
      },
    },
    {
      $addFields: {
        firstScore: {
          $arrayElemAt: ["$match.pointsScored.totalScores", 0],
        },
        oppFirstScore: {
          $arrayElemAt: ["$match.oppScores.totalScores", 0],
        },
        lastScore: {
          $arrayElemAt: ["$match.pointsScored.totalScores", -1],
        },
        oppLastScore: {
          $arrayElemAt: ["$match.oppScores.totalScores", -1],
        },
      },
    },
    {
      $project: {
        fullName: 1,
        match: {
          result: "$match.result",
          type: "$match.type",
          pointsScored: "$match.pointsScored",
          lossOpponent: "$match.lossOpponent",
          winOpponent: "$match.winOpponent",
          totalScored: "$match.totalScored",
          oppScores: "$match.oppScores",
          // matchLength: "$match.matchLength",
          scoresFirst: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ["$oppFirstScore", null],
                  },
                  {
                    $and: [
                      {
                        $ne: ["$firstScore", null],
                      },
                      {
                        $lt: ["$firstScore.time", "$oppFirstScore.time"],
                      },
                    ],
                  },
                ],
              },
              true,
              false,
            ],
          },
          scoresLast: {
            $cond: [
              {
                $or: [
                  {
                    $eq: ["$oppLasttScore", null],
                  },
                  {
                    $and: [
                      {
                        $ne: ["$lastScore", null],
                      },
                      {
                        $gt: ["$lastScore.time", "$oppLastScore.time"],
                      },
                    ],
                  },
                ],
              },
              true,
              false,
            ],
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
        matchesScoreFirst: {
          $size: [
            {
              $filter: {
                input: "$matches.scoresFirst",
                as: "sc",
                cond: {
                  $and: [
                    {
                      $eq: ["$$sc", true],
                    },
                  ],
                },
              },
            },
          ],
        },
        matchesScoreLast: {
          $size: [
            {
              $filter: {
                input: "$matches.scoresLast",
                as: "sc",
                cond: {
                  $and: [
                    {
                      $eq: ["$$sc", true],
                    },
                  ],
                },
              },
            },
          ],
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
        // wonMatchLength: {
        //   $trunc: [
        //     {
        //       $avg: "$wonMatches.matchLength",
        //     },
        //     0,
        //   ],
        // },
        opponentsLostTo: {
          $map: {
            input: "$lostMatches",
            as: "match",
            in: "$$match.lossOpponent",
          },
        },
        totalPS: {
          $sum: "$matches.totalScored",
        },
        totalPC: {
          $sum: "$matches.oppScores.total",
        },
        avgPSPM: {
          $trunc: [
            {
              $avg: "$matches.totalScored",
            },
            0,
          ],
        },
        avgPCPM: {
          $trunc: [
            {
              $avg: "$matches.oppScores.total",
            },
            0,
          ],
        },
        scoreFirstPerc: {
          $trunc: [
            {
              $multiply: [
                {
                  $divide: ["$matchesScoreFirst", "$totalMatches"],
                },
                100,
              ],
            },
            0,
          ],
        },
        scorelastPerc: {
          $trunc: [
            {
              $multiply: [
                {
                  $divide: ["$matchesScoreLast", "$totalMatches"],
                },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        winPercentage: {
          $trunc: [
            {
              $multiply: [
                {
                  $divide: ["$wins", "$totalMatches"],
                },
                100,
              ],
            },
            0,
          ],
        },
        pspcRatio: {
          $cond: [
            {
              $and: [
                {
                  $gt: ["$totalPC", 0],
                },
                {
                  $gt: ["$totalPC", 0],
                },
              ],
            },
            {
              $trunc: [
                {
                  $divide: ["$totalPS", "$totalPC"],
                },
                2,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $unwind: {
        path: "$fullName",
      },
    },
    {
      $project: {
        fullName: 1,
        totalMatches: 1,
        wins: 1,
        losses: 1,
        totalPS: 1,
        totalPC: 1,
        avgPSPM: 1,
        avgPCPML: 1,
        scoreFirstPerc: 1,
        scorelastPerc: 1,
        winPercentage: 1,
        pspcRatio: 1,
      },
    },
    {
      $match: {
        winPercentage: {
          $gt: 70,
        },
        wins: {
          $gt: 5,
        },
      },
    },
    {
      $sort: {
        pspcRatio: -1,
      },
    },
    {
      $limit: 40,
    },
  ]);

  return doc;
};

const individualProfileStats = async id => {
  try {
    const doc = await Wrestler.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
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
          tournamentName: "$matches.tournament.tournamentName",
          totalScored: {
            $cond: [
              {
                $eq: ["$matches.redWrestler.fullName", "$fullName"],
              },
              "$matches.result.redTotalScore",
              "$matches.result.blueTotalScore",
            ],
          },
          oppTotalScored: {
            $cond: [
              {
                $ne: ["$matches.redWrestler.fullName", "$fullName"],
              },
              "$matches.result.redTotalScore",
              "$matches.result.blueTotalScore",
            ],
          },
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
          oppScores: {
            $filter: {
              input: "$matches.scores",
              as: "sc",
              cond: {
                $and: [
                  {
                    $ne: ["$$sc.fullName", "$fullName"],
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
        $project: {
          fullName: 1,
          match: {
            result: "$result",
            type: "$type",
            pointsScored: {
              $cond: ["$wins", "$wins", "$losses"],
            },
            lossOpponent: "$lossOpponent",
            winOpponent: "$winOpponent",
            totalScored: "$totalScored",
            oppTotalScored: "$oppTotalScored",
            oppScores: "$oppScores",
            url: "$url",
          },
        },
      },
      {
        $addFields: {
          firstScore: {
            $arrayElemAt: ["$match.pointsScored", 0],
          },
          oppFirstScore: {
            $arrayElemAt: ["$match.oppScores", 0],
          },
          lastScore: {
            $arrayElemAt: ["$match.pointsScored", -1],
          },
          oppLastScore: {
            $arrayElemAt: ["$match.oppScores", -1],
          },
        },
      },
      {
        $project: {
          fullName: 1,
          match: {
            result: "$match.result",
            type: "$match.type",
            pointsScored: "$match.pointsScored",
            lossOpponent: "$match.lossOpponent",
            winOpponent: "$match.winOpponent",
            totalScored: "$match.totalScored",
            oppTotalScored: "$match.oppTotalScored",
            oppScores: "$match.oppScores",
            scoresFirst: {
              $cond: [
                {
                  $or: [
                    {
                      $eq: ["$oppFirstScore", null],
                    },
                    {
                      $and: [
                        {
                          $ne: ["$firstScore", null],
                        },
                        {
                          $lt: ["$firstScore.time", "$oppFirstScore.time"],
                        },
                      ],
                    },
                  ],
                },
                true,
                false,
              ],
            },
            scoresLast: {
              $cond: [
                {
                  $or: [
                    {
                      $eq: ["$oppLasttScore", null],
                    },
                    {
                      $and: [
                        {
                          $ne: ["$lastScore", null],
                        },
                        {
                          $gt: ["$lastScore.time", "$oppLastScore.time"],
                        },
                      ],
                    },
                  ],
                },
                true,
                false,
              ],
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
          matchesScoreFirst: {
            $size: [
              {
                $filter: {
                  input: "$matches.scoresFirst",
                  as: "sc",
                  cond: {
                    $and: [
                      {
                        $eq: ["$$sc", true],
                      },
                    ],
                  },
                },
              },
            ],
          },
          matchesScoreLast: {
            $size: [
              {
                $filter: {
                  input: "$matches.scoresLast",
                  as: "sc",
                  cond: {
                    $and: [
                      {
                        $eq: ["$$sc", true],
                      },
                    ],
                  },
                },
              },
            ],
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
          opponentsLostTo: {
            $map: {
              input: "$lostMatches",
              as: "match",
              in: "$$match.lossOpponent",
            },
          },
          totalPS: {
            $sum: "$matches.totalScored",
          },
          totalPC: {
            $sum: "$matches.oppTotalScored",
          },
          avgPSPM: {
            $trunc: [
              {
                $avg: "$matches.totalScored",
              },
              0,
            ],
          },
          avgPCPM: {
            $trunc: [
              {
                $avg: "$matches.oppTotalScored",
              },
              0,
            ],
          },
          scoreFirstPerc: {
            $trunc: [
              {
                $multiply: [
                  {
                    $divide: ["$matchesScoreFirst", "$totalMatches"],
                  },
                  100,
                ],
              },
              0,
            ],
          },
          scorelastPerc: {
            $trunc: [
              {
                $multiply: [
                  {
                    $divide: ["$matchesScoreLast", "$totalMatches"],
                  },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          winPercentage: {
            $trunc: [
              {
                $multiply: [
                  {
                    $divide: ["$wins", "$totalMatches"],
                  },
                  100,
                ],
              },
              0,
            ],
          },
          pspcRatio: {
            $cond: [
              {
                $and: [
                  {
                    $gt: ["$totalPC", 0],
                  },
                  {
                    $gt: ["$totalPC", 0],
                  },
                ],
              },
              {
                $trunc: [
                  {
                    $divide: ["$totalPS", "$totalPC"],
                  },
                  2,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $unwind: {
          path: "$fullName",
        },
      },
    ]);
    return doc;
  } catch (e) {
    console.log(e);
  }
};

module.exports.individualProfileStats = individualProfileStats;
module.exports.generalStats = generalStats;
// [
//   {
//     $project: {
//       _id: {
//         $toString: "$_id",
//       },
//       fullName: 1,
//       lastName: 1,
//       team: 1,
//     },
//   },
//   {
//     $lookup: {
//       from: "matches",
//       localField: "_id",
//       foreignField: "redWrestler.id",
//       as: "red",
//     },
//   },
//   {
//     $lookup: {
//       from: "matches",
//       localField: "_id",
//       foreignField: "blueWrestler.id",
//       as: "blue",
//     },
//   },
//   {
//     $project: {
//       _id: 1,
//       fullName: 1,
//       red: 1,
//       blue: 1,
//     },
//   },
//   {
//     $unwind: {
//       path: "$red",
//       preserveNullAndEmptyArrays: false,
//     },
//   },
//   {
//     $unwind: {
//       path: "$blue",
//       preserveNullAndEmptyArrays: false,
//     },
//   },
//   {
//     $project: {
//       fullName: 1,
//       matches: ["$red", "$blue"],
//     },
//   },
//   {
//     $unwind: {
//       path: "$matches",
//       preserveNullAndEmptyArrays: false,
//     },
//   },
//   {
//     $project: {
//       fullName: 1,
//       result: {
//         $cond: [
//           {
//             $eq: ["$matches.result.winner", "$fullName"],
//           },
//           "winner",
//           "loser",
//         ],
//       },
//       type: {
//         $cond: [
//           {
//             $eq: ["$matches.result.winner", "$fullName"],
//           },
//           "$matches.result.victoryType",
//           "$matches.result.fullName",
//         ],
//       },
//       wins: {
//         $filter: {
//           input: "$matches.scores",
//           as: "sc",
//           cond: {
//             $and: [
//               {
//                 $eq: ["$$sc.fullName", "$fullName"],
//               },
//               {
//                 $eq: ["$matches.result.winner", "$fullName"],
//               },
//             ],
//           },
//         },
//       },
//       losses: {
//         $filter: {
//           input: "$matches.scores",
//           as: "sc",
//           cond: {
//             $and: [
//               {
//                 $eq: ["$$sc.fullName", "$fullName"],
//               },
//               {
//                 $eq: ["$matches.result.loser", "$fullName"],
//               },
//             ],
//           },
//         },
//       },
//       lossOpponent: {
//         $cond: [
//           {
//             $and: [
//               {
//                 $eq: ["$matches.result.loser", "$fullName"],
//               },
//             ],
//           },
//           "$matches.result.winner",
//           null,
//         ],
//       },
//       winOpponent: {
//         $cond: [
//           {
//             $and: [
//               {
//                 $eq: ["$matches.result.winner", "$fullName"],
//               },
//             ],
//           },
//           "$matches.result.winner",
//           null,
//         ],
//       },
//       url: "$matches.url",
//     },
//   },
//   {
//     $unwind: {
//       path: "$wins",
//       preserveNullAndEmptyArrays: true,
//     },
//   },
//   {
//     $unwind: {
//       path: "$losses",
//       preserveNullAndEmptyArrays: true,
//     },
//   },
//   {
//     $addFields: {
//       totalScored: {
//         $cond: [
//           {
//             $eq: ["$result", "winner"],
//           },
//           "$wins.total",
//           "$losses.total",
//         ],
//       },
//       matchLength: {
//         $switch: {
//           branches: [
//             {
//               case: {
//                 $and: [
//                   {
//                     $eq: ["$result", "winner"],
//                   },
//                   {
//                     $or: [
//                       {
//                         $eq: ["$type", "VCA"],
//                       },
//                       {
//                         $eq: ["$type", "VFA"],
//                       },
//                       {
//                         $eq: ["$type", "VSU"],
//                       },
//                       {
//                         $eq: ["$type", "VSU1"],
//                       },
//                     ],
//                   },
//                 ],
//               },
//               then: {
//                 $arrayElemAt: ["$wins.totalScores", -1],
//               },
//             },
//             {
//               case: {
//                 $eq: ["$result", "loser"],
//               },
//               then: null,
//             },
//             {
//               case: {
//                 $and: [
//                   {
//                     $eq: ["$result", "winner"],
//                   },
//                   {
//                     $or: [
//                       {
//                         $eq: ["$type", "VPO"],
//                       },
//                       {
//                         $eq: ["$type", "VPO1"],
//                       },
//                     ],
//                   },
//                 ],
//               },
//               then: {
//                 $arrayElemAt: ["$wins.totalScores", -1],
//               },
//             },
//             {
//               case: {
//                 $lt: [0, 5],
//               },
//               then: "",
//             },
//           ],
//         },
//       },
//     },
//   },
//   {
//     $project: {
//       fullName: 1,
//       match: {
//         result: "$result",
//         type: "$type",
//         wins: "$wins",
//         losses: "$losses",
//         lossOpponent: "$lossOpponent",
//         winOpponent: "$winOpponent",
//         totalScored: "$totalScored",
//         matchLength: {
//           $switch: {
//             branches: [
//               {
//                 case: {
//                   $and: [
//                     {
//                       $eq: ["$result", "winner"],
//                     },
//                     {
//                       $or: [
//                         {
//                           $eq: ["$type", "VCA"],
//                         },
//                         {
//                           $eq: ["$type", "VFA"],
//                         },
//                         {
//                           $eq: ["$type", "VSU"],
//                         },
//                         {
//                           $eq: ["$type", "VSU1"],
//                         },
//                       ],
//                     },
//                   ],
//                 },
//                 then: "$matchLength.time",
//               },
//               {
//                 case: {
//                   $eq: ["$result", "loser"],
//                 },
//                 then: null,
//               },
//               {
//                 case: {
//                   $and: [
//                     {
//                       $eq: ["$result", "winner"],
//                     },
//                     {
//                       $or: [
//                         {
//                           $eq: ["$type", "VPO"],
//                         },
//                         {
//                           $eq: ["$type", "VPO1"],
//                         },
//                       ],
//                     },
//                   ],
//                 },
//                 then: 360,
//               },
//               {
//                 case: {
//                   $lt: [0, 5],
//                 },
//                 then: "",
//               },
//             ],
//           },
//         },
//         url: "$url",
//       },
//     },
//   },
//   {
//     $group: {
//       _id: "$_id",
//       fullName: {
//         $addToSet: "$fullName",
//       },
//       matches: {
//         $addToSet: "$match",
//       },
//     },
//   },
//   {
//     $addFields: {
//       lostMatches: {
//         $filter: {
//           input: "$matches",
//           as: "match",
//           cond: {
//             $and: [
//               {
//                 $eq: ["$$match.result", "loser"],
//               },
//             ],
//           },
//         },
//       },
//       wonMatches: {
//         $filter: {
//           input: "$matches",
//           as: "match",
//           cond: {
//             $eq: ["$$match.result", "winner"],
//           },
//         },
//       },
//       totalMatches: {
//         $size: "$matches",
//       },
//     },
//   },
//   {
//     $addFields: {
//       wins: {
//         $size: "$wonMatches",
//       },
//       losses: {
//         $size: "$lostMatches",
//       },
//       opponentsBeat: {
//         $map: {
//           input: "$wonMatches",
//           as: "match",
//           in: "$$match.winOpponent",
//         },
//       },
//       wonMatchLength: {
//         $avg: "$wonMatches.matchLength",
//       },
//       opponentsLostTo: {
//         $map: {
//           input: "$lostMatches",
//           as: "match",
//           in: "$$match.lossOpponent",
//         },
//       },
//     },
//   },
// ];
