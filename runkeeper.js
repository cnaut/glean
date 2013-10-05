// Generated by CoffeeScript 1.6.3
(function() {
  var RunKeeper, getRunkeeperData, session, setSession;

  RunKeeper = require("temboo/Library/RunKeeper/FitnessActivities");

  session = null;

  setSession = function(s) {
    return session = s;
  };

  getRunkeeperData = function(callback, renderPage) {
    var retrieveActivitesChoreo, retrieveActivitesInputs;
    retrieveActivitesChoreo = new RunKeeper.RetrieveActivites(session);
    retrieveActivitesInputs = retrieveActivitesChoreo.newInputSet();
    retrieveActivitesInputs.setCredential("Runkeeper");
    return retrieveActivitesChoreo.execute(retrieveActivitesInputs, (function(results) {
      var activities, activity, activityTime, dateRegex, lastWeek, thisWeek, timeSinceActivity, today, weekDiff, _i, _len;
      today = new Date();
      thisWeek = {
        runs: 0,
        miles: 0,
        minutes: 0
      };
      lastWeek = {
        runs: 0,
        miles: 0,
        minutes: 0
      };
      weekDiff = {};
      activities = JSON.parse(results.get_Response()).items;
      for (_i = 0, _len = activities.length; _i < _len; _i++) {
        activity = activities[_i];
        activity.total_distance = activity.total_distance * .000621;
        activity.duration = activity.duration / 60;
        activityTime = new Date(activity.start_time);
        timeSinceActivity = today.getTime() - activityTime.getTime();
        if (timeSinceActivity < 7 * 86400000) {
          thisWeek.runs++;
          thisWeek.miles += activity.total_distance;
          thisWeek.minutes += activity.duration;
        }
        if (timeSinceActivity >= 7 * 86400000 && timeSinceActivity <= 14 * 86400000) {
          lastWeek.runs++;
          lastWeek.miles += activity.total_distance;
          lastWeek.minutes += activity.duration;
        }
        activity.total_distance = activity.total_distance.toFixed(2);
        activity.duration = activity.duration.toFixed(2);
        activity.minutes_per_mile = (activity.duration / activity.total_distance).toFixed(2);
        dateRegex = /(.*)\d\d:\d\d:\d\d/;
        activity.date = dateRegex.exec(activity.start_time)[1];
      }
      weekDiff.runs = thisWeek.runs - lastWeek.runs;
      weekDiff.miles = (thisWeek.miles - lastWeek.miles).toFixed(2);
      weekDiff.minutes = (thisWeek.minutes - lastWeek.minutes).toFixed(2);
      thisWeek.minutesPerMile = thisWeek.minutes / thisWeek.miles;
      thisWeek.miles = thisWeek.miles.toFixed(2);
      thisWeek.minutes = thisWeek.minutes.toFixed(2);
      lastWeek.minutesPerMile = lastWeek.minutes / lastWeek.miles;
      lastWeek.miles = lastWeek.miles.toFixed(2);
      lastWeek.minutes = lastWeek.minutes.toFixed(2);
      weekDiff.minutesPerMile = (thisWeek.minutesPerMile - lastWeek.minutesPerMile).toFixed(2);
      thisWeek.minutesPerMile = thisWeek.minutesPerMile.toFixed(2);
      lastWeek.minutesPerMile = lastWeek.minutesPerMile.toFixed(2);
      weekDiff.runsClass = (weekDiff.runs >= 0 ? "positive-points" : "negative-points");
      weekDiff.milesClass = (weekDiff.miles >= 0 ? "positive-points" : "negative-points");
      weekDiff.minutesClass = (weekDiff.minutes >= 0 ? "positive-points" : "negative-points");
      weekDiff.minutesPerMileClass = (weekDiff.minutesPerMile >= 0 ? "negative-points" : "positive-points");
      if (renderPage) {
        return callback.render(renderPage, {
          activities: activities,
          thisWeek: thisWeek,
          lastWeek: lastWeek,
          weekDiff: weekDiff
        });
      } else {
        return callback(null, {
          activities: activities,
          thisWeek: thisWeek,
          lastWeek: lastWeek,
          weekDiff: weekDiff
        });
      }
    }), function(error) {
      console.log(error.type);
      return console.log(error.message);
    });
  };

  module.exports = {
    setSession: setSession,
    getRunkeeperData: getRunkeeperData
  };

}).call(this);
