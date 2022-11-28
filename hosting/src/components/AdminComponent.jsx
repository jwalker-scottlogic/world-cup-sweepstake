import React, { useState, useEffect } from "react";
import classnames from "classnames";
import EditablePlayerTable from "./EditablePlayerTable";
import "./AdminComponent.css";

const AdminComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [goals, setGoals] = useState("");
  const [teams, setTeams] = useState({});
  const [goalTeam1, setGoalTeam1] = useState("");
  const [goalTeam2, setGoalTeam2] = useState("");
  const [outcomeTeam1, setOutcomeTeam1] = useState("");
  const [outcomeTeam2, setOutcomeTeam2] = useState("");
  const [outcomeTeam3, setOutcomeTeam3] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [players, setPlayers] = useState([]);

  const getData = async (url, setFunc) => {
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json);
    }

    setFunc(json);
  };

  const loadData = async () => {
    setIsLoading(true);

    try {
      await Promise.all([
        getData(`/api/players`, setPlayers),
        getData(`/api/competition/teams`, setTeams),
      ]);
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    selectTeams();
  }, [teams]);

  useEffect(() => {
    checkIsValid();
  }, [
    name,
    goals,
    goalTeam1,
    goalTeam2,
    outcomeTeam1,
    outcomeTeam2,
    outcomeTeam3,
  ]);

  const onUpdate = async (player) => {
    try {
      setIsLoading(true);
      await fetch("/api/players", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: player,
      });
      loadData();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onDelete = async (id) => {
    try {
      setIsLoading(true);
      await fetch(`/api/players/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      loadData();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          goalsPredicted: Number(goals),
          teams: {
            goals: [goalTeam1, goalTeam2],
            outcomes: [outcomeTeam1, outcomeTeam2, outcomeTeam3],
          },
        }),
      });
      setName("");
      setGoals("");
      selectTeams();
      loadData();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const checkIsValid = () => {
    setIsValid(name.length !== 0 && checkGoals() && checkTeamsIsUnique());
  };

  const checkTeamsIsUnique = () => {
    let teamArray = [
      goalTeam1,
      goalTeam2,
      outcomeTeam1,
      outcomeTeam2,
      outcomeTeam3,
    ];
    return new Set(teamArray).size === 5;
  };

  const checkGoals = () => {
    return Number.isInteger(+goals) && Number.parseInt(goals, 10) >= 0;
  };

  const getTeamSelect = (value, onChange) => {
    return (
      <select value={value} onChange={onChange}>
        {Object.keys(teams).map((key) => (
          <option value={key}>{key}</option>
        ))}
      </select>
    );
  };

  const removeRandomTeam = (teams) => {
    const index = Math.floor(Math.random() * teams.length);
    const team = teams[index];
    teams.splice(index, 1);
    return team;
  };

  const selectTeams = () => {
    const availableTeams = Object.keys(teams);
    setGoalTeam1(removeRandomTeam(availableTeams));
    setGoalTeam2(removeRandomTeam(availableTeams));
    setOutcomeTeam1(removeRandomTeam(availableTeams));
    setOutcomeTeam2(removeRandomTeam(availableTeams));
    setOutcomeTeam3(removeRandomTeam(availableTeams));
  };

  const getAdminClassNames = () => {
    return classnames({
      isLoading,
      adminComponent: true,
    });
  };

  return (
    <div className={getAdminClassNames()}>
      <div className="content">
        <div className="form-block">
          <label>Name: </label>
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div className="form-block">
          <label>Total goals: </label>
          <input
            value={goals}
            onChange={({ target }) => setGoals(target.value)}
          />
        </div>
        <div className="form-block">
          <label>Goal team 1: </label>
          {getTeamSelect(goalTeam1, ({ target }) => setGoalTeam1(target.value))}
        </div>
        <div className="form-block">
          <label>Goal team 2: </label>
          {getTeamSelect(goalTeam2, ({ target }) => setGoalTeam2(target.value))}
        </div>
        <div className="form-block">
          <label>Outcome team 1: </label>
          {getTeamSelect(outcomeTeam1, ({ target }) =>
            setOutcomeTeam1(target.value)
          )}
        </div>
        <div className="form-block">
          <label>Outcome team 2: </label>
          {getTeamSelect(outcomeTeam2, ({ target }) =>
            setOutcomeTeam2(target.value)
          )}
        </div>
        <div className="form-block">
          <label>Outcome team 3: </label>
          {getTeamSelect(outcomeTeam3, ({ target }) =>
            setOutcomeTeam3(target.value)
          )}
        </div>
        <div className="form-block">
          <button disabled={!isValid} onClick={onSubmit}>
            Submit
          </button>
        </div>
        <button onClick={selectTeams}>Pick teams</button>
        {
          <EditablePlayerTable
            rows={players}
            teams={teams}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        }
      </div>
    </div>
  );
};

export default AdminComponent;
