const createFilterOptions = async doc => {
  try {
    const weightClass = new Set([]);
    const tournament = new Set([]);
    const team = new Set([]);
    const opponent = new Set([]);
    const scoringTech = new Set([]);
    const concededTech = new Set([]);
    const round = new Set([]);
    const result = new Set([]);
    const winLoss = new Set([]);
    const docs = await doc;
    if (docs) {
      // const map = await Promise.all(
      docs.forEach(match => {
        weightClass.add(match.weightClass);
        tournament.add(match.tournamentName);
        team.add(match.opponent.team);
        opponent.add(match.opponent.fullName);
        round.add(match.round);
        result.add(match.result.victoryType);
        winLoss.add(match.wrestlerResult);
      });
      // );
    }

    const filters = {
      weightClass: [...weightClass],
      team: [...team],
      opponent: [...opponent],
      result: [...result],
      round: [...round],
      winLoss: [...winLoss],
      tournament: [...tournament],
    };
    return filters;
  } catch (e) {
    console.log(e);
  }
};

const createIndividualTechFilterOptions = async doc => {
  try {
    const weightClass = new Set([]);
    // const tournament = new Set([]);
    // const team = new Set([]);
    // time
    //const opponent = new Set([]);
    const offDefTech = new Set([]);
    const position = new Set([]);
    const round = new Set([]);
    const type = new Set([]);
    const setup = new Set([]);
    const points = new Set([]);
    const wrestler = new Set([]);
    const takedown = new Set([]);

    const docs = await doc;
    if (docs) {
      // const map = await Promise.all(
      docs.forEach(takedown => {
        weightClass.add(takedown.weightClass);
        offDefTech.add(takedown.tournamentName);
        position.add(takedown.opponent.team);
        type.add(takedown.opponent.fullName);
        round.add(takedown.round);
        setup.add(takedown.result.victoryType);
        points.add(takedown.result.victoryType);
        wrestler.add(takedown.wrestlerResult);
        takedown.add(takedown);
      });
      // );
    }

    const filters = {
      weightClass: [...weightClass],
      team: [...team],
      opponent: [...opponent],
      result: [...result],
      round: [...round],
      winLoss: [...winLoss],
      tournament: [...tournament],
      takedown: [...takedown],
    };
    return filters;
  } catch (e) {
    console.log(e);
  }
};

//techniqeu stats by team, athlete, tournaent, time, etc...
const createTechFilterOptions = async doc => {
  try {
    const weightClass = new Set([]);
    const offDefTech = new Set([]);
    const position = new Set([]);
    const round = new Set([]);
    const type = new Set([]);
    const setup = new Set([]);
    const points = new Set([]);
    const wrestler = new Set([]);
    const takedown = new Set([]);

    const docs = await doc;
    if (docs) {
      const map = docs.forEach(td => {
        console.log(td);
        weightClass.add(td.weightClass);
        offDefTech.add(td.offdef);
        position.add(td.position);
        round.add(td.round);
        type.add(td.type);
        setup.add(...td.setup);

        points.add(td.points);
        wrestler.add(td.wrestler);
        takedown.add(td.takedown);
      });
    }

    const filters = {
      weightClass: [...weightClass],
      offdef: [...offDefTech],
      position: [...position],
      type: [...type],
      round: [...round],
      setup: [...setup],
      points: [...points],
      wrestler: [...wrestler],
      takedown: [...takedown],
    };
    return filters;
  } catch (e) {
    console.log("the error", e);
  }
};

const convertFilters = filters => {
  if (filters) {
    const filt = Object.entries(JSON.parse(filters))
      .map(([key, arr]) => {
        if (arr.length >= 1) {
          const filterItem = arr.map(filter => {
            return { [key]: filter };
          });
          return { $or: filterItem };
        }
      })
      .filter(item => item !== undefined && item !== []);
    return filt;
  }
};

exports.createTechFilterOptions = createTechFilterOptions;
exports.createFilterOptions = createFilterOptions;
exports.convertFilters = convertFilters;
