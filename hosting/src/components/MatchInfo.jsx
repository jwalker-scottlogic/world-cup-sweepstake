import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import classnames from "classnames";

import "./MatchInfo.css";

const UpcomingMatches = ({ matches, teams, onHover }) => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [today] = useState(DateTime.utc().startOf("day"));

  const areDatesSameDay = (d1, d2) => d1.hasSame(d2, "day");
  const getMatchTime = (date) => date.toLocaleString(DateTime.TIME_24_SIMPLE);

  const renderMatchStatus = (match) => {
    switch (match.status) {
      case "IN_PLAY":
      case "PAUSED":
        return <span className="live">Live</span>;
      case "FINISHED":
        return <span>FT</span>;
      default:
        return <span></span>;
    }
  };

  const teamClassNames = (team, homeOrAway) =>
    classnames("match-team", `match-team-${homeOrAway}`, {
      "team-highlighted": teams[team].isHighlighted,
    });

  const displayMatchScore = (status) =>
    status === "IN_PLAY" || status === "FINISHED" || status === "PAUSED";

  const renderRow = (match) => (
    <div
      key={`${match.homeTeam.name}-${match.awayTeam.name}`}
      className="match"
    >
      <div className="match-result">
        <div
          className={teamClassNames(match.homeTeam.name, "home")}
          onMouseEnter={(_) => onHover(match.homeTeam.name)}
          onMouseOut={(_) => onHover(undefined)}
        >
          {match.homeTeam.name}
        </div>
        {displayMatchScore(match.status) ? (
          <div className="match-score">
            <div className="match-goals match-goals-home">
              {match.score.fullTime.homeTeam}
            </div>
            <div className="match-goals match-goals-away">
              {match.score.fullTime.awayTeam}
            </div>
          </div>
        ) : (
          <div className="match-time">{getMatchTime(match.luxonDate)}</div>
        )}
        <div
          className={teamClassNames(match.awayTeam.name, "away")}
          onMouseEnter={(_) => onHover(match.awayTeam.name)}
          onMouseOut={(_) => onHover(undefined)}
        >
          {match.awayTeam.name}
        </div>
      </div>
      <div className="match-status">{renderMatchStatus(match)}</div>
    </div>
  );

  const renderMatchDate = (dt) => {
    if (areDatesSameDay(today, dt)) {
      return <h3 className="match-date">Today</h3>;
    } else {
      return (
        <h3 className="match-date">
          {upcomingMatches[0].luxonDate.toFormat("dd MMMM")}
        </h3>
      );
    }
  };

  useEffect(() => {
    // Get all matches from today.
    const allUpcoming = matches.filter(
      (m) => m.luxonDate.diff(today, "days").toObject().days >= 0
    );

    if (!allUpcoming || allUpcoming.length === 0) {
      setUpcomingMatches([]);
    } else {
      // Get matches that are on the next match day.
      setUpcomingMatches(
        matches.filter((m) =>
          areDatesSameDay(allUpcoming[0].luxonDate, m.luxonDate)
        )
      );
    }
  }, [matches]);

  return (
    <div className="upcoming-matches">
      <h2>Matches</h2>
      {upcomingMatches.length === 0 ? (
        <div>No further matches scheduled</div>
      ) : (
        <div className="match-info">
          {renderMatchDate(upcomingMatches[0].luxonDate)}
          {upcomingMatches.map((match) => renderRow(match))}
          <div>Total matches: {matches.length}</div>
          <div>
            Total played:{" "}
            {matches.filter((m) => m.status === "FINISHED").length}
          </div>
          <div>
            Total remaining:{" "}
            {matches.filter((m) => m.status !== "FINISHED").length}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingMatches;
