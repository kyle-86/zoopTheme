window.addEventListener('load', function () {

  let table; // Define 'table' at a higher scope
  let searchOdds = 9999;
  let searchValue = 0;
  let bankroll = user_settings.user_bankroll;
  let kellyPercent = user_settings.user_kellystake;


  jQuery(document).ready(function ($) {
    // Load JSON data (replace 'your-data.json' with the path to your JSON file)

    $.getJSON('http://127.0.0.1:8000/', function (data) {

      var currentDate = moment(); // Get the current date and time

      $.getJSON('/zoop/wp-json/zoop/v1/bets', function (userBets) {

        console.log(data);

        var filteredData = data.filter(function (row) {
          var userIdAsInt = parseInt(currentUserId, 10);
          var eventTime = moment(row.eventTime, "DDMMYYYY, HH:mm");

          // console.log('Row:', row);
          // console.log('EventTime:', eventTime.format('YYYY-MM-DD HH:mm:ss'));
          // console.log('CurrentDate:', currentDate.format('YYYY-MM-DD HH:mm:ss'));

          // Check conditions for the current row
          var rowCondition = row.value > 0 && eventTime.isSameOrAfter(currentDate);

          // Check if the current row meets any userBet condition
          var meetsUserBetCondition = !userBets.some(function (userBet) {
            var userbetIdAsInt = parseInt(userBet.bet_id, 10);

            // console.log('UserBet:', userBet);

            // Adjust the condition based on your data structure
            var userBetCondition = userbetIdAsInt === row.id && userIdAsInt === currentUserId;

            return userBetCondition;
          });

          // Combine conditions to determine if the row should be included
          return rowCondition && meetsUserBetCondition;
        });


        // Initialize DataTables with the loaded data DataTable.datetime('D MMM YYYY');
        var storedMinValue = localStorage.getItem('minValueSearch') || '';
        var storedMaxOdds = localStorage.getItem('maxOddsSearch') || '';

        // Set the initial values of the input fields
        $('#minValueSearch').val(storedMinValue);
        $('#maxOddsSearch').val(storedMaxOdds);

        DataTable.datetime('DDMMYYYY, HH:mm');

        table = $('#valueBets').on('init.dt', function () {

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
              data: 'eventTime',
              render: function (data, type, row) {
                var momentDate = moment(data, "DDMMYYYY, HH:mm");  // Use "HH" instead of "hh"
                var formattedDate = momentDate.format("MMM Do YYYY [at] hh:mm A");
                return (type === 'display' || type === 'filter') ? formattedDate : data;
              }
            },
            { data: 'teams' },
            { data: 'league' },
            { data: 'betTeam' },
            { data: 'betType' },
            { data: 'agency' },
            {
              data: 'value',
              render: function (data, type, row) {
                // Apply twoDecimalPoints() only for display
                return (type === 'display' || type === 'filter') ? twoDecimalPoints(data) + '%' : data;
              }
            },
            {
              data: 'odds',
              render: function (data, type, row) {
                // Apply twoDecimalPoints() only for display
                return (type === 'display' || type === 'filter') ? '$' + twoDecimalPoints(data) : data;
              }
            }
          ],

          initComplete: function () {
            // Reference to the DataTable instance
            let table = this;

            // Add event listeners to input fields for filtering
            $('#minValueSearch, #maxOddsSearch').on('keyup change', function () {
              // Store the current values in localStorage
              localStorage.setItem('minValueSearch', $('#minValueSearch').val());
              localStorage.setItem('maxOddsSearch', $('#maxOddsSearch').val());

              table.draw(); // Redraw the DataTable on input change
            });

            // Restore state
            var state = table.api().state.loaded();
            if (state) {
              table.api().columns().eq(0).each(function (colIdx) {
                var colSearch = state.columns[colIdx].search;

                if (colSearch.search) {
                  $('input', table.api().column(colIdx).header()).val(colSearch.search);
                }
              });

              table.api().draw();
            }

            var minValueSearch = $('#minValueSearch');
            var maxOddsSearch = $('#maxOddsSearch');

            // Custom range filtering function
            DataTable.ext.search.push(function (settings, data, dataIndex) {

              var min = parseInt(minValueSearch.val(), 10) || 0;
              var max = parseInt(maxOddsSearch.val(), 10) || 9999;

              var dataValue = parseFloat(data[6]) || 0; // use data for the dataValue column
              var dataOddsString = data[7].replace('$', ''); // Remove the dollar sign
              var dataOdds = parseFloat(dataOddsString);

              if (
                (min <= dataValue && dataOdds <= max)
              ) {
                return true;
              }

              return false;
            });


            // Changes to the inputs will trigger a redraw to update the table
            minValueSearch.on('input', function () {
              table.api().draw();
            });
            maxOddsSearch.on('input', function () {
              table.api().draw();
            });

          },

        });

      });

    });

  });




  function kelly_calcs(odds, probability_of_winning, bankroll) {
    // console.log(odds);
    // console.log(probability_of_winning);
    // console.log(bankroll);

    odds = parseFloat(odds);
    // Convert probability_of_winning from percentage to decimal
    probability_of_winning = parseFloat(probability_of_winning) / 100;

    // Calculate probability of losing
    let probability_of_losing = 1 - probability_of_winning;

    // Calculate fraction (f) using the alternative Kelly Criterion formula
    let f = (probability_of_winning * (odds - 1) - probability_of_losing) / (odds - 1);

    // Calculate the recommended bet amount based on the user's specified Kellystake
    // let recommended_bet = (f * bankroll * user_settings.user_kellystake).toFixed(2);
    let recommended_bet = (f * bankroll * kellyPercent).toFixed(2);

    return recommended_bet; // The recommended bet amount
  }

  function convertDecimalOdds(decimalOdds) {
    // Convert to fractional odds
    decimalOdds = parseFloat(decimalOdds);
    const fractionalOdds = (decimalOdds - 1)
      .toFixed(2)
      .toString()
      .replace(".", "/");

    // Convert to win percentage
    const winPercentage = ((1 / decimalOdds) * 100).toFixed(2);

    return winPercentage;
  }

  function subtractPercentage(decimalNumber, percentage) {
    const subtractedValue = decimalNumber - decimalNumber * (percentage / 100);
    return subtractedValue;
  }

  function twoDecimalPoints(value) {
    parsedValue = parseFloat(value);
    formattedValue = `${parsedValue.toFixed(2)}`;

    return formattedValue;
  }

  jQuery('#valueBets tbody').on('click', 'td', function () {
    // Get the clicked DataTable cell
    let cell = jQuery(this);

    // Get the DataTable row associated with the clicked cell
    let row = cell.closest('tr');

    // Get the DataTable instance
    let table = jQuery('#valueBets').DataTable();

    // Get the data from the clicked row
    let rowData = table.row(row).data();

    // console.log(rowData);

    // Extract specific properties
    let teams = rowData.teams;
    let odds = rowData.odds;
    let id = rowData.id;

    let eventTime = rowData.eventTime;
    let momentDate = moment(eventTime, "DDMMYYYY, hh:mm");
    let formattedDate = momentDate.format("MMM Do YYYY [at] hh:mm A");

    let betTeam = rowData.betTeam;
    let agency = rowData.agency;
    let value = rowData.value;

    let refrenceid = rowData.refrenceId;
    let betLeague = rowData.league;
    let betAgency = rowData.agency;
    let betSport = rowData.sport;
    let betLine = rowData.line;
    let betType = rowData.betType;

    let bookmakerOdds = subtractPercentage(odds, value);
    let probability_of_winning = convertDecimalOdds(bookmakerOdds);
    let recommendedBetAmount = kelly_calcs(
      odds,
      probability_of_winning,
      bankroll
    );

    // Populate modal content with the extracted data
    var modalContent =
      '<div class="bet-stats small" ' +
      'data-betid="' + id + '" ' +
      'data-betrefrenceid="' + refrenceid + '" ' +
      'data-betleague="' + betLeague + '" ' +
      'data-betagency="' + betAgency + '" ' +
      'data-betsport="' + betSport + '" ' +
      'data-bettype="' + betType + '" ' +
      'data-betline="' + betLine + '">' +
      '<div class="bet-stat pb-1">' +
      '<span class="bet-title">Event: </span>' +
      '<span class="bet-data db-bet-teams">' + teams + '</span>' +
      '</div>' +
      '<div class="bet-stat pb-1">' +
      '<span class="bet-title">Event Start: </span>' +
      '<span class="bet-data db-bet-date">' + formattedDate + '</span>' +
      '</div>' +
      '<div class="bet-stat pb-1 mt-2">' +
      '<span class="bet-title">Agency: </span>' +
      '<span class="bet-data">' + agency + '</span>' +
      '</div>' +
      '<div class="bet-stat pb-1 mt-2">' +
      '<span class="bet-title">League: </span>' +
      '<span class="bet-data">' + betLeague + '</span>' +
      '</div>' +
      '<div class="bet-stat pb-1">' +
      '<span class="bet-title">Prediction: </span>' +
      '<span class="bet-data db-bet-team">' + betTeam + '</span>' +
      '</div>' +
      '<div class="bet-stat pb-1">' +
      '<span class="bet-title">Value: </span>' +
      '<span class="bet-data db-bet-value">' + twoDecimalPoints(value) + '%</span>' +
      '</div>' +
      '<div class="bet-stat pb-1">' +
      '<span class="bet-title">Odds: </span>' +
      '<span class="bet-data db-bet-odds">$' + twoDecimalPoints(odds) + '</span>' +
      '</div>' +
      '<div class="bet-stat pb-1 mt-2">' +
      '<span class="bet-title">Bet Amount: </span>' +
      '<span class="bet-data">' + `$<input type="number" class="betAmount" id="betAmountInput${id
      }" value="${recommendedBetAmount}"> </span>
          </div>` +
      '<div class="bet-stat">' +
      '<span class="bet-title">Potential Odds: </span>' +
      '<span class="bet-data">$' + twoDecimalPoints(recommendedBetAmount * odds) + '</span>' +
      '</div>' +
      '</div>';


    jQuery('#betsModal .modal-body').html(modalContent);

    // Show the modal
    jQuery('#betsModal').modal('show');

    const inputElement = document.querySelector(`#betAmountInput${id
      }`);
    if (inputElement) {
      // Add an event listener to the input element
      inputElement.addEventListener("input", function () {
        const betAmount = parseFloat(this.value);
        const potentialProfitElement = this.parentElement.parentElement.nextElementSibling.querySelector('.bet-data');

        if (!isNaN(betAmount)) {
          const potentialProfit = betAmount * odds;
          potentialProfitElement.textContent = '$' + twoDecimalPoints(potentialProfit);
        } else {
          potentialProfitElement.textContent = "";
        }
      });
    }
  });

  document.querySelector('.save-bet-button').addEventListener('click', function () {

    let currentTicket = document.querySelector('.bet-stats');

    var dataToSave = {
      // 'user_id': ,
      'user_id': currentUserId,
      'bet_teams': document.querySelector('.db-bet-teams').innerHTML,
      'bet_league': currentTicket.dataset.betleague,
      'bet_id': parseFloat(currentTicket.dataset.betid),
      'bet_agency': currentTicket.dataset.betagency,
      'bet_value': parseFloat(document.querySelector('.db-bet-value').innerHTML.replace('%', '')),
      'betAmount': parseFloat(document.querySelector('.betAmount').value),
      'bet_betTeam': document.querySelector('.db-bet-team').innerHTML,
      'bet_odds': parseFloat(document.querySelector('.db-bet-odds').innerHTML.replace('$', '')),
      'bet_sport': currentTicket.dataset.betsport,
      'bet_refrenceId': currentTicket.dataset.betrefrenceid,
      'bet_eventTime': document.querySelector('.db-bet-date').innerHTML,
      'bet_line': currentTicket.dataset.betline,
      'bet_betType': currentTicket.dataset.bettype,

      // Add more fields as needed
    };

    // console.log(dataToSave);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', ajax_object.ajax_url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    // Convert data to URL-encoded format
    var formData = Object.keys(dataToSave).map(function (key) {
      return encodeURIComponent('data_to_save[' + key + ']') + '=' + encodeURIComponent(dataToSave[key]);
    }).join('&');

    // console.log(formData);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {

        if (xhr.status === 200) {
          // Handle success response
          console.log('Data saved successfully.');

          location.reload();

        } else {
          // Handle error response
          console.error('Error saving data:', xhr.statusText);
        }
      }
    };

    xhr.send('action=save_data_to_custom_table&' + formData);
  });



});