const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const Tournament = require("../db/models/tournament.js");
const Match = require("../db/models/match.js");
const Team = require("../db/models/team.js");
const Wrestler = require("../db/models/wrestler");
const uniqid = require("uniqid");
const User = require("../db/models/user");

const deleteAllbyTournamentId = async id => {
  try {
    const deleted = await Match.deleteMany({
      "tournament.tournamentId": mongoose.Types.ObjectId(id),
    });
    console.log(deleted);
  } catch (e) {
    console.log(e);
  }
};

const idArr = [];
const uuidArr = [];

const scrapeTournament = async link => {
  try {
    const browser = await puppeteer.launch({
      headless: true, //change to true in prod!
    });

    let x = 0;
    const page = await browser.newPage();
    await page.goto(link);
    var content = await page.content();
    const tournament = await page.evaluate(() => {
      return document.querySelector(
        "body > div.dialog-off-canvas-main-canvas > div > div.region.region-content > div > div > div:nth-child(1) > div > section > div.node.node--type-event.node--view-mode-default > div > div > div > div > span.field.field--name-node-title.field--type-ds.field--label-hidden.field--item > h1"
      ).textContent;
    }, content);
    const link = await page.evaluate(() => {
      return document
        .querySelector(
          "#arena_content > div.c-accordian.c-accordian--schedule > div:nth-child(1) > div.c-accordian__slave.c-accordian__slave--small > table > tbody > tr > td.text-center > strong > h3 > a"
        )
        .getAttribute("data-url");
    }, content);
    const year = await page.evaluate(() => {
      return document.querySelector(
        "body > div.dialog-off-canvas-main-canvas > div > div.region.region-content > div > div > div:nth-child(1) > div > section > div.node.node--type-event.node--view-mode-default > div > div > div > div > p > strong"
      ).textContent;
    }, content);
    const country = await page.evaluate(() => {
      return document.querySelector(
        "body > div.dialog-off-canvas-main-canvas > div > div.region.region-content > div > div > div:nth-child(1) > div > section > div.node.node--type-event.node--view-mode-default > div > div > div > div > p > strong > span > span "
      ).textContent;
    }, content);
    // const city = await page.evaluate(() => {
    //   return document.querySelector(
    //     "body > div.dialog-off-canvas-main-canvas > div > div.region.region-content > div > div > div:nth-child(1) > div > section > div.node.node--type-event.node--view-mode-default > div > div > div > div > p > strong > span > span > span.field.field--name-taxonomy-term-title.field--type-ds.field--label-hidden.field--item"
    //   ).textContent;
    // }, content);
    const loc = country.match(/\w+( \w+)*$/gim);
    console.log("tournament", tournament.trim());
    console.log("coutnry", loc[0]);
    console.log("year", year.match(/\d{4}/gm)[0]);
    console.log("city", loc[1]);
    const lit = link.split("match/");
    const ye = year.match(/\d{4}/gm)[0];
    const tournie = await Tournament.findOneAndUpdate(
      {
        name: `${ye} ${tournament.trim()}`,
        type: tournament.trim(),
        location: {
          city: loc[1],
          country: loc[0],
        },
        year: ye,
        owner: "60a2a5803bb95bbc1c18b767",
      },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true },
      function (error, result) {
        if (error) console.log(error);

        // do something with the document
      }
    );

    for (let i = 0; i < 1000; i++) {
      if (x < 15) {
        try {
          const npage = await browser.newPage();
          await npage.goto(`${lit[0]}match/${i}`);
          var ncontent = await npage.content();
          const innerText = await npage.evaluate(() => {
            return JSON.parse(document.querySelector("body > pre").textContent);
          }, ncontent);
          try {
            const {
              match: {
                id,
                fighter1FullName,
                fighter2FullName,
                fighter1FamilyName,
                fighter2FamilyName,
                team1AlternateName,
                team1Name,
                team2Name,
                fighter1Id,
                fighter2Id,
                team2AlternateName,
                roundFriendlyName,
                technicalPoints,
                technicalPointsTagStatus,
                weightCategoryMaxWeight,
                audienceShortName,
                sportName,
                victoryType,
                endTime,
                fighter1RankingPoint,
                fighter2RankingPoint,
                round,
                round1Id,
                round2Id,
              },
            } = await innerText;
            if (
              sportName === "Women's wrestling" ||
              sportName === "Greco-Roman"
            ) {
              continue;
            }
            const { eventName = "Freestyle" } =
              innerText?.match?.uploaderFight || "";
            const videoUrl =
              innerText.match?.uploaderFight?.current_video.videoUrl || "";
            const data = innerText.match;
            const addingWrestlers = async () => {
              const check1 = await Wrestler.find({
                lastName: fighter1FamilyName,
              });
              if (check1) {
                const oldWres = check1.filter(
                  wres =>
                    wres.fullName.split(" ").join("").toLowerCase() ===
                    fighter1FullName.split(" ").join("").toLowerCase()
                );
                if (oldWres) {
                  return oldWres[0];
                }
              }
            };
            const addingWrestlers2 = async () => {
              const check1 = await Wrestler.find({
                lastName: fighter2FamilyName,
              });
              if (check1) {
                const oldWres = check1.filter(
                  wres =>
                    wres.fullName.split(" ").join("").toLowerCase() ===
                    fighter2FullName.split(" ").join("").toLowerCase()
                );
                if (oldWres) {
                  return oldWres[0];
                }
              }
            };
            const old1 = await addingWrestlers();
            const old2 = await addingWrestlers2();
            const wrestler1 = old1
              ? old1
              : await Wrestler.findOneAndUpdate(
                  {
                    fullName: fighter1FullName,
                    lastName: fighter1FamilyName,
                    team: team1Name,
                    owner: "60a2a5803bb95bbc1c18b767",
                    private: false,
                  },
                  {},
                  { upsert: true, new: true, setDefaultsOnInsert: true },
                  function (error, result) {
                    if (error) console.log(error);
                  }
                );
            const wrestler2 = old2
              ? old2
              : await Wrestler.findOneAndUpdate(
                  {
                    fullName: fighter2FullName,
                    lastName: fighter2FamilyName,
                    team: team2Name,
                    owner: "60a2a5803bb95bbc1c18b767",
                    private: false,
                  },
                  {},
                  { upsert: true, new: true, setDefaultsOnInsert: true },
                  function (error, result) {}
                );
            const winner =
              fighter1RankingPoint > fighter2RankingPoint
                ? wrestler1.fullName
                : wrestler2.fullName;
            const loser =
              fighter1RankingPoint < fighter2RankingPoint
                ? wrestler1.fullName
                : wrestler2.fullName;

            ///////////////////////Extracting Scores///////////////////////
            //////////////////////////////////////////////////////////////////////////
            const newArr = Object.values(data.technicalPoints).map(round => {
              const totalScores = Object.entries(round.rounds).map(
                ([key, score], ind) => {
                  const scor = Object.values(score.points).map(
                    ({ points, second }) => {
                      return {
                        id: uniqid.process(),
                        points,
                        time: second,
                        fullName: round.fullName,
                        round: ind + 1,
                      };
                    }
                  );
                  return { ...scor };
                }
              );

              const totalm = Object.values(totalScores).map(i => i);
              const [round1scores = [], round2scores = []] = totalm;
              const r1 = Object.values(round1scores).map(i => i);
              const r2 = Object.values(round2scores).map(i => i);
              return {
                fullName: round.fullName,
                color: round.fullName === fighter1FullName ? "red" : "blue",
                totalScores: [...r1, ...r2],
                total: round.total,
              };
            });

            const redTotalScore =
              newArr.filter(wr => wr.color === "red")[0]?.total || 0;
            const blueTotalScore =
              newArr.filter(wr => wr.color === "blue")[0]?.total || 0;
            console.log(redTotalScore, "-", blueTotalScore);
            let scoresFixed = [];
            const mo = newArr.map(wrestler => {
              if (wrestler.totalScores) {
                return wrestler.totalScores;
              }
            });
            const m = mo;
            if (m[0] && m[1]) {
              scoresFixed = [...m[0], ...m[1]].sort((a, b) => {
                return a.time - b.time;
              });
            }

            if (m[0] && !m[1]) {
              scoresFixed = m[0].sort((a, b) => {
                return a.time - b.time;
              });
            }

            if (m[1] && !m[0]) {
              scoresFixed = m[1].sort((a, b) => {
                return a.time - b.time;
              });
            }
            const finalScore = scoresFixed.map(sc => {
              return {
                ...sc,
                fullName:
                  sc.fullName === fighter1FullName
                    ? wrestler1.fullName
                    : wrestler2.fullName,
                wrestlerId:
                  sc.fullName === fighter1FullName
                    ? wrestler1._id
                    : wrestler2._id,
              };
            });
            /////////Wrestler ADD//////////////
            const winnerPoints =
              fighter1RankingPoint > fighter2RankingPoint
                ? fighter1RankingPoint
                : fighter2RankingPoint;
            const loserPoints =
              fighter1RankingPoint > fighter2RankingPoint
                ? fighter2RankingPoint
                : fighter1RankingPoint;
            const result1 =
              roundFriendlyName === "Final 1-2" && winner === fighter1FullName
                ? 1
                : roundFriendlyName === "Final 1-2"
                ? 2
                : roundFriendlyName === "Final 3-5" &&
                  winner === fighter1FullName
                ? 3
                : roundFriendlyName === "Final 3-5"
                ? 5
                : "";
            const result2 =
              roundFriendlyName === "Final 1-2" && winner === fighter2FullName
                ? 1
                : roundFriendlyName === "Final 1-2"
                ? 2
                : roundFriendlyName === "Final 3-5" &&
                  winner === fighter2FullName
                ? 3
                : roundFriendlyName === "Final 3-5"
                ? 5
                : "";

            const team1 = await Team.findOneAndUpdate(
              {
                teamName: team1Name,
                owner: "60a2a5803bb95bbc1c18b767",
                private: false,
              },
              {},
              { upsert: true, new: true, setDefaultsOnInsert: true },
              function (error, result) {
                if (error) console.log(error);
              }
            );
            const team2 = await Team.findOneAndUpdate(
              {
                teamName: team2Name,
                owner: "60a2a5803bb95bbc1c18b767",
                private: false,
              },
              {},
              { upsert: true, new: true, setDefaultsOnInsert: true },
              function (error, result) {
                if (error) console.log(error);
              }
            );
            const match = await Match.findOneAndUpdate(
              {
                tournament: {
                  tournamentId: tournie._id,
                  tournamentName: tournie.name,
                  tournamentType: tournie.type,
                },
                style: sportName,
                weightClass: weightCategoryMaxWeight,
                round: roundFriendlyName,
                redWrestler: {
                  id: wrestler1._id,
                  fullName: wrestler1.fullName,
                  team: wrestler1.team,
                },
                blueWrestler: {
                  id: wrestler2._id,
                  fullName: wrestler2.fullName,
                  team: wrestler2.team,
                },
              },
              {
                tournament: {
                  tournamentId: tournie._id,
                  tournamentName: tournie.name,
                  tournamentType: tournie.type,
                },
                style: sportName,
                weightClass: weightCategoryMaxWeight,
                round: roundFriendlyName,
                redWrestler: {
                  id: wrestler1._id,
                  fullName: wrestler1.fullName,
                  team: wrestler1.team,
                },
                blueWrestler: {
                  id: wrestler2._id,
                  fullName: wrestler2.fullName,
                  team: wrestler2.team,
                },
                result: {
                  victoryType,
                  winnerPoints,
                  loserPoints,
                  winner,
                  loser,
                  redTotalScore,
                  blueTotalScore,
                },
                url: videoUrl,
                scores: finalScore,
                private: false,
                owner: "60a2a5803bb95bbc1c18b767",
                organization: "United World Wrestling",
              },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log("i =", i);
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          x += 1;
          console.log("x =", x);
          continue;
        }
      } else {
        break;
      }
    }

    await browser.close();
  } catch (e) {
    return e;
  }
};

module.exports = scrapeTournament;
