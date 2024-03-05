document.addEventListener("DOMContentLoaded", function () {

  let jsonData = []; // Store the JSON data globally
  const loadingAnimation = document.querySelector(".loader");
  const chartCanvas = document.querySelector(".theChart");
  const ctx = document.getElementById("winningLineChart").getContext("2d");
  const lineChart = new Chart(ctx, {
    type: "line",
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  function calculateBetsInTimeFrame(data, year, month, day, week) {
    return data.reduce((total, bet) => {
      if (parseInt(bet.user_id) === currentUserId) {
        const betDate = parseDate(bet.bet_eventTime);

        console.log(bet)

        if (
          (year === null || betDate.getFullYear() === year) &&
          (month === null || betDate.getMonth() === month) &&
          (day === null || betDate.getDate() === day) &&
          (week === null || getWeekNumber(betDate) === week) &&
          bet.bet_result !== ""
        ) {
          return total + 1;
        }
      }
      return total;
    }, 0);
  }
  function calculateBetAmountInTimeFrame(data, year, month, day, week) {
    return data.reduce((total, bet) => {
      if (parseInt(bet.user_id) === currentUserId) {
        const betDate = parseDate(bet.bet_eventTime);

        if (
          (year === null || betDate.getFullYear() === year) &&
          (month === null || betDate.getMonth() === month) &&
          (day === null || betDate.getDate() === day) &&
          (week === null || getWeekNumber(betDate) === week) &&
          bet.bet_result !== ""
        ) {
          return total + parseFloat(bet.betAmount);
        }
      }
      return total;
    }, 0);
  }
  function calculateTotalAmountWon(bet, currentUserId) {
    if (parseInt(bet.user_id) === currentUserId) {
      if (bet.bet_betTeam === bet.bet_result) {
        // Calculate winnings based on the bet amount and odds, subtract the stake
        return parseFloat((bet.betAmount * bet.bet_odds - bet.betAmount).toFixed(2));
      } else if (bet.bet_result !== "") {
        // Calculate losses or negative winnings based on odds, subtract the stake
        return -parseFloat(bet.betAmount);
      }
    }
    // Default case when the bet doesn't meet the criteria
    return 0;
  }
  function calculateTotalAmountWonInTimeFrame(data, year, month, day, week) {
    return data.reduce((total, bet) => {
      const betDate = parseDate(bet.bet_eventTime);
      if (
        (year === null || betDate.getFullYear() === year) &&
        (month === null || betDate.getMonth() === month) &&
        (day === null || betDate.getDate() === day) &&
        (week === null || getWeekNumber(betDate) === week) &&
        parseInt(bet.user_id) === currentUserId
      ) {
        const amountWon = calculateTotalAmountWon(bet, currentUserId);
        // Use toFixed(2) to round to 2 decimal places
        return total + parseFloat(amountWon.toFixed(2));
      }
      return total;
    }, 0);
  }
  // Helper function to get the ISO week number
  function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
    );
  }
  function parseDate(dateString) {

    console.log(dateString);

    const dateComponents = dateString.split(' '); // Split the date string by spaces

    // Extract day, month, and year based on the positions in the array
    let day = dateComponents[1];
    day = day.replace(/\D/g, '');
    const monthAbbreviation = dateComponents[0];
    const months = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const month = months[monthAbbreviation];
    const year = dateComponents[2];

    console.log(`${year}-${month}-${day}`);

    return new Date(`${year}-${month}-${day}`);
  }
  function prepareBetData(selectedDate) {
    // Example usage:
    const today = new Date();
    const totalWiningsDiv = document.querySelector(".totalWinings");
    const totalStaked = document.querySelector(".totalStaked");
    const totalBetsDiv = document.querySelector(".totalBets");
    const avgBetDiv = document.querySelector(".avgBet");
    const chartData = {
      bets: [], // Initialize an empty array for bets
      winnings: [], // Initialize an empty array for winnings
    };
    const labels = [];
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let currentWeek = getWeekNumber(today);
    let totalBetProfit = 0;
    let totalBets = 0;
    let avgBets = 0;
    let totalStackedAmount = 0;
    let averageBets = 0;
    const yearArray = [];
    for (let year = 2023; year <= currentYear; year++) {
      yearArray.push(year);
    }
    const chartLabelData = {
      allTime: yearArray,
      lastYear: [
        "January",
        "Febuary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      lastMonth: ["4 Weeks Ago", "3 Weeks Ago", "2 Weeks Ago", "Last Week"], // Modify as needed for weeks
      lastWeek: ["Sun", "Mon", "Tues", "Wed", "Thursday", "Fri", "Sat"], // Modify as needed for days
      today: ["Today"],
    };
    if (selectedDate == "allTime") {
      for (const year of yearArray) {
        const totalWinningsForAll = calculateTotalAmountWonInTimeFrame(jsonData, year, null, null, null);
        const totalBetsForAll = calculateBetsInTimeFrame(jsonData, year, null, null, null);
        const totalBetAmountForAll = calculateBetAmountInTimeFrame(jsonData, year, null, null, null);
        totalBetProfit += totalWinningsForAll;
        totalBets += totalBetsForAll;
        avgBets += totalBetAmountForAll;
        // Push the year as the label
        labels.push(year);
        // Push the total bets and winnings for the year to the chart data
        chartData.bets.push(totalBetsForAll);
        chartData.winnings.push(totalWinningsForAll);
      }
    }
    else if (selectedDate == "lastYear") {
      for (let i = 0; i < 12; i++) {
        const totalWinningsForYear = calculateTotalAmountWonInTimeFrame(
          jsonData,
          currentYear,
          currentMonth,
          null,
          null
        );
        const totalBetsForYear = calculateBetsInTimeFrame(
          jsonData,
          currentYear,
          currentMonth,
          null,
          null
        );
        const totalBetAmountForYear = calculateBetAmountInTimeFrame(jsonData, currentYear, currentMonth, null, null);
        labels.unshift(
          chartLabelData[selectedDate][currentMonth] + " - " + currentYear
        ); // Use unshift to add the current month label to the beginning
        chartData.bets.unshift(totalBetsForYear);
        chartData.winnings.unshift(totalWinningsForYear);
        // Update the current month and year for the next iteration, moving backward
        if (currentMonth === 0) {
          currentMonth = 11;
          currentYear--;
        } else {
          currentMonth--;
        }
        totalBetProfit += totalWinningsForYear;
        totalBets += totalBetsForYear;
        avgBets += totalBetAmountForYear;
      }
    } else if (selectedDate === "lastMonth") {
      for (let i = 0; i < 4; i++) {
        labels.push(chartLabelData.lastMonth[i]);
        const totalWinningsForWeek = calculateTotalAmountWonInTimeFrame(
          jsonData,
          currentYear,
          null,
          null,
          currentWeek
        );
        const totalBetsForWeek = calculateBetsInTimeFrame(
          jsonData,
          currentYear,
          null,
          null,
          currentWeek
        );
        const totalBetAmountForWeek = calculateBetAmountInTimeFrame(
          jsonData,
          currentYear,
          null,
          null,
          currentWeek
        );
        chartData.bets.unshift(totalBetsForWeek);
        chartData.winnings.unshift(totalWinningsForWeek);
        if (currentWeek === 1) {
          currentWeek = 52; // Set it to the last week of the previous year (ISO week)
          if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
          } else {
            currentMonth--;
          }
        } else {
          currentWeek--;
        }
        totalBetProfit += totalWinningsForWeek;
        totalBets += totalBetsForWeek;
        avgBets += totalBetAmountForWeek;
      }
    }
    else if (selectedDate === "lastWeek") {
      for (let i = 0; i < 7; i++) {
        // Calculate the start date for the current day
        const startDate = new Date(currentYear, currentMonth, today.getDate() - i);
        // Handle cases where the day becomes negative by adjusting the month and year
        if (today.getDate() - i < 1) {
          const prevMonth = currentMonth - 1;
          if (prevMonth < 0) {
            startDate.setFullYear(currentYear - 1);
            startDate.setMonth(11); // December
          } else {
            startDate.setMonth(prevMonth);
          }
          const daysInPrevMonth = new Date(currentYear, prevMonth + 1, 0).getDate();
          startDate.setDate(daysInPrevMonth + (today.getDate() - i));
        }
        // Calculate the week number for the current date
        const weekNumber = getWeekNumber(startDate);
        // Calculate the current day for the startDate
        const currentDay = startDate.getDay();
        // Calculate the total winnings, bets, and bet amount for the week
        const totalWinningsForWeek = calculateTotalAmountWonInTimeFrame(
          jsonData,
          null,
          null,
          startDate.getDate(),
          weekNumber
        );
        const totalBetsForWeek = calculateBetsInTimeFrame(
          jsonData,
          null,
          null,
          startDate.getDate(),
          weekNumber
        );
        const totalBetAmountForWeek = calculateBetAmountInTimeFrame(
          jsonData,
          null,
          null,
          startDate.getDate(),
          weekNumber
        );
        labels.unshift(
          chartLabelData.lastWeek[currentDay] +
          " - " +
          startDate.getDate() +
          "/" +
          (startDate.getMonth() + 1) +
          "/" +
          startDate.getFullYear()
        );
        chartData.bets.unshift(totalBetsForWeek);
        chartData.winnings.unshift(totalWinningsForWeek);
        totalBetProfit += totalWinningsForWeek;
        totalBets += totalBetsForWeek;
        avgBets += totalBetAmountForWeek;
        totalStackedAmount = 2333;
      }
    }
    else if (selectedDate === "today") {
      // Filter bets for today
      const betsForToday = jsonData.filter((bet) => {
        const betDate = parseDate(bet.bet_eventTime);
        return (
          betDate.getFullYear() === currentYear &&
          betDate.getMonth() === currentMonth &&
          betDate.getDate() === today.getDate() &&
          getWeekNumber(betDate) === currentWeek
        );
      });
      // Initialize empty arrays to store bets and winnings for today
      const totalBetsToday = [];
      const totalWinningsToday = [];
      // Initialize empty arrays to store labels for each bet
      const betLabels = [];
      // Iterate through bets and calculate total bets and winnings for each bet
      betsForToday.forEach((bet) => {
        const bets = calculateBetsInTimeFrame(
          [bet],
          currentYear,
          currentMonth,
          today.getDate(),
          currentWeek
        );
        const winnings = calculateTotalAmountWonInTimeFrame(
          [bet],
          currentYear,
          currentMonth,
          today.getDate(),
          currentWeek
        );
        const totalBetAmountForDay = calculateBetAmountInTimeFrame(
          [bet],
          currentYear,
          currentMonth,
          today.getDate(),
          currentWeek
        );
        totalBetProfit += winnings;
        totalBets += bets;
        avgBets += totalBetAmountForDay;
        totalBetsToday.push(bets);
        totalWinningsToday.push(winnings);
        // Add the betTeam as the label for this bet
        betLabels.push(bet.bet_betTeam);
      });
      // Extend the labels array with the betTeam labels
      labels.push(...betLabels);
      // Extend the chartData arrays with the bets and winnings for each bet
      chartData.bets.unshift(...totalBetsToday);
      chartData.winnings.unshift(...totalWinningsToday);
    }
    totalWiningsDiv.textContent = '$' + totalBetProfit.toFixed(2);
    totalStaked.textContent = '$' + avgBets.toFixed(2);
    totalBetsDiv.textContent = totalBets;
    if (totalBets > 0) {
      averageBets = avgBets / totalBets
      avgBetDiv.textContent = '$' + averageBets.toFixed(2);
    } else {
      avgBetDiv.textContent = '$0.00'
    }
    return {
      labels: labels,
      datasets: [
        {
          label: "# of Bets",
          data: chartData.bets,
          borderWidth: 1,
          borderColor: "#26AFEA", // Line color for number of bets
          backgroundColor: "rgba(0, 0, 255, 0.1)", // Fill color for number of bets
        },
        {
          label: "Profit",
          data: chartData.winnings,
          borderWidth: 1,
          borderColor: "green", // Line color for winnings
          backgroundColor: "rgba(0, 128, 0, 0.1)", // Fill color for winnings
        },
      ],
    };
  }
  function updateChart(chartData, chartElement) {
    chartElement.data.labels = chartData.labels;
    chartElement.data.datasets = chartData.datasets;
    chartElement.update(); // Update the chart
  }
  fetch("/zoop/wp-json/zoop/v1/bets")
    .then((response) => response.json())
    .then((data) => {
      jsonData = data; // Store the JSON data globally
      let chartData = prepareBetData("lastWeek");
      updateChart(chartData, lineChart);
      loadingAnimation.style.display = "none";
      chartCanvas.style.display = "block";
      const timePeriodRadios = document.querySelectorAll(
        'input[name="time-period"]'
      );
      timePeriodRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
          const selectedDate = document.querySelector(
            'input[name="time-period"]:checked'
          ).value;
          // alert(selectedDate);
          // prepareBetData(selectedDate); // Update total amount won
          // Update the Line Chart with the filtered data
          chartData = prepareBetData(selectedDate);
          updateChart(chartData, lineChart);
        });
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});

window.addEventListener('load', function () {
  let table; // Define 'table' at a higher scope
  jQuery(document).ready(function ($) {
    // Load JSON data (replace 'your-data.json' with the path to your JSON file)
    var currentDate = moment(); // Get the current date and time
    $.getJSON('/zoop/wp-json/zoop/v1/bets', function (userBets) {
      let filteredData = userBets.filter(element => {
        let userIdAsInt = parseInt(element.user_id, 10);
        let betComplete = element.bet_result != '';
        return userIdAsInt === currentUserId && betComplete;
      });
      DataTable.datetime('MMM Do YYYY [at] hh:mm A');
      table = $('#completedBets').on('init.dt', function () {
      }).DataTable({
        data: filteredData,
        stateSave: true,
        columnDefs: [
          {
            targets: 0,
          }
        ],
        columns: [
          {
            data: 'bet_eventTime'
          },
          { data: 'bet_betTeam' },
          { data: 'bet_line' },
          { data: 'bet_agency' },
          {
            data: 'betAmount',
            render: function (data, type, row) {
              // Apply twoDecimalPoints() only for display
              return (type === 'display' || type === 'filter') ? '$' + twoDecimalPoints(data) : data;
            }
          },
          {
            data: 'bet_odds',
            render: function (data, type, row) {
              // Apply twoDecimalPoints() only for display
              return (type === 'display' || type === 'filter') ? '$' + twoDecimalPoints(data) : data;
            }
          },
          {
            // Custom column for an icon (replace 'your-icon-class' with your actual CSS class)
            data: null,
            render: function (data, type, row) {
              var betOdds = row.bet_odds;
              var betAmount = row.betAmount;
              var betTeam = row.bet_betTeam;
              var betResult = row.bet_result;

              return (betTeam === betResult)
                ? '$' + twoDecimalPoints(betOdds * betAmount - betAmount)
                : '-$' + twoDecimalPoints(betAmount);
            }
          },
          {
            // Custom column for an icon (replace 'your-icon-class' with your actual CSS class)
            data: null,
            render: function (data, type, row) {
              var betTeam = row.bet_betTeam;
              var betResult = row.bet_result;

              return (betTeam === betResult) ? 'Winner' : 'Loser';
            }
          }
        ],
      });
    });
  });
  function twoDecimalPoints(value) {
    parsedValue = parseFloat(value);
    formattedValue = `${parsedValue.toFixed(2)}`;
    return formattedValue;
  }
});