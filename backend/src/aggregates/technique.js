const Match = require("../db/models/match");
const {
  createFilterOptions,
  createTechFilterOptions,
  convertFilters,
} = require("../helpers/helpers");

const allTechniques = async (id, filters, skip) => {
  try {
    let skipTech = {
      $skip: parseInt(skip),
    };
    const filt = convertFilters(filters);
    let filter = {
      $match: {},
    };
    console.log("this is filter", filt);
    if (filt !== []) {
      filter = {
        $match: {
          $and: [
            {
              points: { $gt: 0 },
            },
            ...filt,
          ],
        },
      };
    }
    console.log(convertFilters(filters));
    const doc = await Match.aggregate([
      {
        $unwind: {
          path: "$scores",
        },
      },
      {
        $match: {
          "scores.takedown": {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $project: {
          _id: 0,
          url: "$url",
          weightClass: 1,
          style: 1,
          opponent: {
            $cond: [
              {
                $eq: ["$redWrestler.fullName", "$scores.fullName"],
              },
              "$blueWrestler.fullName",
              "$redWrestler.fullName",
            ],
          },
          wrestler: {
            $cond: [
              {
                $eq: ["$redWrestler.fullName", "$scores.fullName"],
              },
              "$redWrestler.fullName",
              "$blueWrestler.fullName",
            ],
          },
          takedownId: "$scores.id",
          round: "$scores.round",
          name: "$scores.name",
          takedown: "$scores.takedown",
          offdef: "$scores.offdef",
          position: "$scores.position",
          oppDefendedShot: "$scores.oppDefendedShot",
          setup: "$scores.setup",
          type: "$scores.type",
          details: "$scores.details",
          videoTime: "$scores.videoTime",
          time: "$scores.time",
          points: "$scores.points",
        },
      },

      filter,
      skipTech,
    ]);
    const fields = await createTechFilterOptions(doc);

    return { matches: doc.slice(0, 20), filters: fields };
  } catch (e) {
    console.log(e);
  }
};

module.exports.allTechniques = allTechniques;
