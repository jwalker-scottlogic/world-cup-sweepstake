import React from "react";
import classnames from "classnames";

import Table from "./Table";
import EditablePlayerRow from "./EditablePlayerRow";

const headings = [
  { title: "#" },
  { title: "Name" },
  { title: "Goal Teams", colspan: 2 },
  { title: "Outcome Teams", colspan: 3 },
  { title: "Goals Predicted" },
  { title: "Actions", colspan: 2 },
];

const EditablePlayerTable = ({ teams, rows }) => {
  const renderRow = (row, rank) => {
    return <EditablePlayerRow rank={rank} teams={teams} row={row} />;
  };

  return (
    <div className="player-table">
      <h2>Players</h2>
      <Table headings={headings} rows={rows} renderRow={renderRow} />
    </div>
  );
};

export default EditablePlayerTable;
