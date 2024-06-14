import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

import PlayerTable from "./PlayerTable";
import CompetitionTable from "./CompetitionTable";
import MatchInfo from "./MatchInfo";
import ErrorWrapper from "./Error";

import RefreshIcon from "../images/RefreshIcon.svg";

const ENTRY_FEE = 1;

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);
  const [players, setPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [teams, setTeams] = useState({});
  const [error, setError] = useState(undefined);

  const getData = async (url, setFunc, mapFunc) => {
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json);
    }

    setFunc(mapFunc ? mapFunc(json) : json);
  };

  const loadData = async (isLiveData) => {
    setIsLoading(true);

    try {
      await Promise.all([
        getData(`/api/players?live=${isLiveData}`, setPlayers),
        getData(`/api/competition/teams?live=${isLiveData}`, setTeams),
        getData("/api/competition/fixtures", setFixtures, (fixtures) =>
          fixtures.map((f) => ({
            ...f,
            luxonDate: DateTime.fromISO(f.utcDate),
          }))
        ),
      ]);
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  const getTeamsAsArray = (teams) => {
    return Object.keys(teams).map((key) => {
      return {
        ...teams[key],
        name: key,
      };
    });
  };

  const getPrizePool = () => {
    const totalCash = players.length * ENTRY_FEE;
    return {
      first: (totalCash * 0.6).toFixed(2),
      middle: (totalCash * 0.2).toFixed(2),
      last: (totalCash * 0.2).toFixed(2),
    };
  };

  const reloadData = () => {
    if (!isLoading) {
      loadData();
    }
  };

  const toggleLiveData = () => setIsLiveData(!isLiveData);

  const onTeamHover = (team) => {
    const newTeams = { ...teams };
    Object.keys(newTeams).forEach((t) => {
      newTeams[t].isHighlighted = t === team;
    });
    setTeams(newTeams);
  };

  useEffect(() => {
    loadData(isLiveData);
  }, [isLiveData]);

  return (
    <div className="Dashboard">
      {error && <ErrorWrapper message={error} />}

      {isLoading && (
        <div className="loading">
          <p>Loading competition data...</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="content">
          <div className="data-options">
            <label
              className="live-data-checkbox"
              title="By default only displaying data for finished games, checking this will also use games which are in play to display the tables 'as it stands'"
            >
              <input
                type="checkbox"
                disabled={isLoading}
                checked={isLiveData}
                onChange={toggleLiveData}
              />
              Use live data for tables?
            </label>
            <div className="refresh-data" onClick={reloadData}>
              <img
                className="refresh-icon"
                alt="Refresh"
                src={RefreshIcon}
                width="24"
                height="16"
              />
              Refresh data
            </div>
          </div>
          <div className="left">
            <div className="prize-pool">
              <h2>Current Prize Pool</h2>
              <p>
                First: &pound;{getPrizePool().first} - Middle: &pound;
                {getPrizePool().middle} - Last: &pound;
                {getPrizePool().last}
              </p>
            </div>
            <MatchInfo matches={fixtures} onHover={onTeamHover} teams={teams} />
            <PlayerTable rows={players} teams={teams} onHover={onTeamHover} />
          </div>
          <CompetitionTable
            rows={getTeamsAsArray(teams)}
            onHover={onTeamHover}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
