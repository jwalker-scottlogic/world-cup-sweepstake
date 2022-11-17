import React, { useState, useEffect } from "react";

const EditablePlayerRow = ({ rank, teams, row }) => {
  const [name, setName] = useState(row.name);
  const [goals, setGoals] = useState(row.goalsPredicted);
  const [goalTeam1, setGoalTeam1] = useState(row.teams.goals[0]);
  const [goalTeam2, setGoalTeam2] = useState(row.teams.goals[1]);
  const [outcomeTeam1, setOutcomeTeam1] = useState(row.teams.outcomes[0]);
  const [outcomeTeam2, setOutcomeTeam2] = useState(row.teams.outcomes[1]);
  const [outcomeTeam3, setOutcomeTeam3] = useState(row.teams.outcomes[2]);
  const [isValid, setIsValid] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const id = row.id;

  useEffect(() => {
    checkIsValid();
    checkIsUpdated();
  }, [
    name,
    goals,
    goalTeam1,
    goalTeam2,
    outcomeTeam1,
    outcomeTeam2,
    outcomeTeam3,
  ]);

  const onUpdate = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/players", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          goalsPredicted: Number(goals),
          teams: {
            goals: [goalTeam1, goalTeam2],
            outcomes: [outcomeTeam1, outcomeTeam2, outcomeTeam3],
          },
        }),
      });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/players", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          goalsPredicted: Number(goals),
          teams: {
            goals: [goalTeam1, goalTeam2],
            outcomes: [outcomeTeam1, outcomeTeam2, outcomeTeam3],
          },
        }),
      });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
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

  const checkIsValid = () => {
    setIsValid(name.length !== 0 && checkGoals() && checkTeamsIsUnique());
  };

  const checkIsUpdated = () => {
    setIsUpdated(
      row.name !== name ||
        row.goalsPredicted !== goals ||
        row.teams.goals[0] !== goalTeam1 ||
        row.teams.goals[1] !== goalTeam2 ||
        row.teams.outcomes[0] !== outcomeTeam1 ||
        row.teams.outcomes[1] !== outcomeTeam2 ||
        row.teams.outcomes[2] !== outcomeTeam3
    );
  };

  const renderTeamEdit = (team, allTeams, setTeam) => {
    return (
      <td>
        <select value={team} onChange={({ target }) => setTeam(target.value)}>
          {Object.keys(allTeams).map((key) => (
            <option value={key}>{key}</option>
          ))}
        </select>
      </td>
    );
  };

  return (
    <tr key={row.name}>
      <td>{rank}</td>
      <td>
        <input value={name} onChange={({ target }) => setName(target.value)} />
      </td>
      {renderTeamEdit(goalTeam1, teams, setGoalTeam1)}
      {renderTeamEdit(goalTeam2, teams, setGoalTeam2)}
      {renderTeamEdit(outcomeTeam1, teams, setOutcomeTeam1)}
      {renderTeamEdit(outcomeTeam2, teams, setOutcomeTeam2)}
      {renderTeamEdit(outcomeTeam3, teams, setOutcomeTeam3)}
      <td>
        <input
          value={goals}
          onChange={({ target }) => setGoals(target.value)}
        />
      </td>
      <td>
        <button disabled={!isValid || !isUpdated} onClick={onUpdate}>
          Update
        </button>
      </td>
      <td>
        <button onClick={onDelete}>Delete</button>
      </td>
    </tr>
  );
};

export default EditablePlayerRow;
