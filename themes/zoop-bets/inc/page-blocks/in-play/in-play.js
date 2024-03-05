window.addEventListener('load', function () {
  let table; // Define 'table' at a higher scope
  let searchOdds = 9999;
  let searchValue = 0;
  let bankroll = 1000;
  jQuery(document).ready(function ($) {
    
    // Load JSON data (replace 'your-data.json' with the path to your JSON file)
    var currentDate = moment(); // Get the current date and time
    $.getJSON('/zoop/wp-json/zoop/v1/bets', function (userBets) {
      
      let filteredData = userBets.filter(element => {
        let userIdAsInt = parseInt(element.user_id, 10);
        let eventTime = moment(element.bet_eventTime, "MMM Do YYYY [at] hh:mm A");
        return userIdAsInt === currentUserId && eventTime.isBefore(currentDate) && element.bet_result === '';
      });
      console.log(filteredData);
      DataTable.datetime('MMM Do YYYY [at] hh:mm A');
      table = $('#inPlay').on('init.dt', function () {
        customSearchFunction();
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
          { data: 'bet_teams' },
          { data: 'bet_league' },
          { data: 'bet_betTeam' },
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
        ],
        initComplete: function () {
          let searchParams = [];
          // Reference to the DataTable instance
          let table = this;
          table.api().columns().every(function () {
            let column = this;
            let title = column.header().getAttribute('data-field');
            // Check if the column is 'value' or 'odds'
            if (column.dataSrc() === 'value' || column.dataSrc() === 'odds') {
              // Create input element
              let input = document.createElement('input');
              input.placeholder = title;
              $(input).appendTo($(column.header()).empty());
              // Event listener for user input
              $(input).on('keyup', function () {
                // Parse the input value to a number
                let inputValue = parseFloat(this.value);
                // Check if the input is a valid number
                if (!isNaN(inputValue)) {
                  // Store the search parameter for the specific column
                  searchParams[column.index()] = inputValue;
                } else {
                  // Remove the search parameter if the input is not a valid number
                  searchParams[column.index()] = '';
                }
                // Update the DataTable search term for the specific column
                table.api().column(column.index()).search(searchParams[column.index()]).draw();
                // Update the state search information
                let state = table.api().state();
                state.columns[column.index()].search.search = searchParams[column.index()];
                table.api().state.save(); // Save the updated state
                // Remove existing search function for the column
                $.fn.dataTable.ext.search.pop();
                // Add new search function for the column
                $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                  let columnData = parseFloat(data[column.index()]);
                  let valueColumnIndex = 4; // Replace with the index of the 'value' column
                  let oddsColumnIndex = 5; // Replace with the index of the 'odds' column
                  let valueColumnData = parseFloat(data[valueColumnIndex]);
                  let oddsColumnData = parseFloat(data[oddsColumnIndex].replace('$', ''));
                  if (column.dataSrc() === 'value') {
                    searchValue = isNaN(inputValue) ? 0 : inputValue;
                  }
                  if (column.dataSrc() === 'odds') {
                    searchOdds = isNaN(inputValue) ? 9999 : inputValue;
                  }
                  if (
                    (isNaN(valueColumnData) || valueColumnData > searchValue) &&
                    (isNaN(oddsColumnData) || oddsColumnData < searchOdds)
                  ) {
                    return true; // Include in search results
                  }
                  return false; // Exclude from search results
                });
                // Redraw the DataTable
                table.api().draw();
              });
            }
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
        },
      });
    });
  });
  function customSearchFunction() {
    // Find the first input field in the DataTable header
    let firstInputField = jQuery('#inPlay thead input');
    // Trigger the keyup event on the first input field
    firstInputField.trigger('keyup');
  }
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
    let recommended_bet = (f * bankroll * 0.5).toFixed(2);
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
  jQuery('#inPlay tbody').on('click', '.trashBet', function () {
    // Get the clicked DataTable cell
    let cell = jQuery(this);
    // Get the DataTable row associated with the clicked cell
    let row = cell.closest('tr');
    // Get the DataTable instance
    let table = jQuery('#inPlay').DataTable();
    // Get the data from the clicked row
    let rowData = table.row(row).data();
    // Extract the ID
    let betId = rowData.id;
    alert(betId);
    // Confirm deletion
    if (confirm('Are you sure you want to delete this bet?')) {
      // Make an AJAX request to delete the record
      jQuery.ajax({
        type: 'POST',
        url: ajax_object.ajax_url,
        data: {
          action: 'delete_bet_data',
          bet_id: betId,
        },
        success: function (response) {
          if (response.success) {
            // Optionally, you can remove the row from the DataTable on success
            table.row(row).remove().draw();
            // Display a success message or perform any other actions
            alert('Record deleted successfully');
          } else {
            alert('Error deleting record: ' + response.data);
          }
        },
        error: function (error) {
          alert('AJAX error: ' + error.statusText);
        },
      });
    }
  });
  jQuery('#inPlay tbody').on('click', '.editBet', function () {
    // Get the clicked DataTable cell
    let cell = jQuery(this);
    // Get the DataTable row associated with the clicked cell
    let row = cell.closest('tr');
    // Get the DataTable instance
    let table = jQuery('#inPlay').DataTable();
    // Get the data from the clicked row
    let rowData = table.row(row).data();
    let teams = rowData.bet_teams;
    let odds = rowData.bet_odds;
    let id = rowData.id;
    let eventTime = rowData.bet_eventTime;
    let betTeam = rowData.bet_betTeam;
    let betAmount = rowData.betAmount;
    let value = rowData.bet_value;
    console.log('betAmount:', betAmount);
    console.log('id:', id);
    let refrenceid = rowData.bet_refrenceId;
    let betLeague = rowData.bet_league;
    let betAgency = rowData.bet_agency;
    let betSport = rowData.bet_sport;
    let betLine = rowData.bet_line;
    let betType = rowData.bet_betType;
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
      'data-ticketid="' + id + '" ' +
      'data-betline="' + betLine + '">' +
      '<div class="bet-stat pb-1">' +
      '<span class="bet-title">Event: </span>' +
      '<span class="bet-data db-bet-teams">' + teams + '</span>' +
      '</div>' +
      '<div class="bet-stat pb-1">' +
      '<span class="bet-title">Event Start: </span>' +
      '<span class="bet-data db-bet-date">' + eventTime + '</span>' +
      '</div>' +
      '<div class="bet-stat pb-1 mt-2">' +
      '<span class="bet-title">Agency: </span>' +
      '<span class="bet-data">' + betAgency + '</span>' +
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
      }" value="${betAmount}"> </span>
          </div>` +
      '</div>';
    jQuery('#betsModal .modal-body').html(modalContent);
    // Show the modal
    jQuery('#betsModal').modal('show');
  });
  document.querySelector('.update-bet-button').addEventListener('click', function () {
    let currentTicket = document.querySelector('.bet-stats');
    var dataToSave = {
      'ticket_id': currentTicket.dataset.id,
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