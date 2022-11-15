import React, { useState, useEffect } from "react";
import classnames from "classnames";
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

  const fetchTeams = async () => {
    setIsLoading(true);
    const response = await fetch("/api/competition/teams");
    const json = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      throw new Error(json);
    }

    setTeams(json);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    selectTeams();
  }, [teams]);

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
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
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
          <button onClick={onSubmit}>Submit</button>
        </div>
        <button onClick={selectTeams}>Pick teams</button>
      </div>
    </div>
  );
};

export default AdminComponent;
