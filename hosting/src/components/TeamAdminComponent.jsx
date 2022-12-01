import React, { useState, useEffect } from "react";

import Table from "./Table";

const headings = [{ title: "Team" }, { title: "Is Eliminated" }];
const TeamAdminComponent = ({ teams, onReload }) => {
  const [rowTeams, setRowTeams] = useState([]);

  useEffect(() => {
    setRowTeams(
      Object.keys(teams).map((team) => ({ ...teams[team], name: team }))
    );
  }, [teams]);

  const setIsTeamEliminated = async (isEliminated, team) => {
    try {
      await fetch(`/api/competition/teams/${team.name}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isEliminated,
        }),
      });
      onReload();
    } catch (error) {
      console.log(error);
    }
  };

  const renderRow = (team) => {
    return (
      <tr key={team.name}>
        <td>{team.name}</td>
        <td>
          <input
            type="checkbox"
            checked={team.isEliminated}
            onChange={(e) => setIsTeamEliminated(e.target.checked, team)}
          ></input>
        </td>
      </tr>
    );
  };

  return <Table headings={headings} rows={rowTeams} renderRow={renderRow} />;
};

export default TeamAdminComponent;
