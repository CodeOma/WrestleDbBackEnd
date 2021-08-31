const { AllStats, WrestlerStats } = require("../db/models/stats");
const {
  totalTechnique,
  totalDefTechnique,

  totalSetup,
  totalSpecific,
  allWrestlers,
  wrestlerStats,
} = require("../aggregates/allWrestlers");
const updateStatsAll = async wrestlerId => {
  const totSetup = await totalSetup();
  const totTechnique = await totalTechnique();
  const totDefTechnique = await totalDefTechnique();

  const updateStats = await AllStats.findOneAndUpdate(
    { _id: "61198f224e1bc7cce942d928" },
    {
      array: [totTechnique, totDefTechnique, totSetup],
    }
  );
};

const createWrestlerStats = () => {};

exports.updateStatsAll = updateStatsAll;
exports.createWrestlerStats = createWrestlerStats;
