window.addEventListener('load', function () {
  let currentSortedColumn = null;
  let isAscending = true;

  // Function to format date and time
  function formatDateTime(dateTimeString) {
    const [datePart, timePart] = dateTimeString.split(', ');

    // Parse the date part (assuming it's in the format 'DDMMYYYY')
    const day = datePart.substring(0, 2);
    const month = datePart.substring(2, 4);
    const year = datePart.substring(4, 8);

    // Parse the time part (assuming it's in the format 'HH:mm')
    const [hours, minutes] = timePart.split(':');

    // Create a new Date object with the parsed components
    const dateTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}`);

    // Format the date and time
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formattedDateTime = dateTime.toLocaleDateString('en-US', options);

    // Add the ordinal suffix to the day
    const formattedDay = (parseInt(day, 10) < 10 ? day.charAt(1) : day) + getOrdinalSuffix(parseInt(day, 10));

    // Replace the day in the formatted date with the one including the suffix
    return formattedDateTime.replace(/\d+/, formattedDay);
  }

  // Function to get the ordinal suffix for a given day
  function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
      return 'th';
    } else {
      const lastDigit = day % 10;
      switch (lastDigit) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    }
  }

  // Function to fetch data
  async function getValueBets() {
    try {
      const response = await fetch("http://127.0.0.1:8000/");
      const bets = await response.json();

      // Check if bets is an array
      if (Array.isArray(bets)) {
        // Filter bets that have a value
        const validBets = bets.filter(bet => bet.value !== "no value");

        // Get the table element by its ID (assuming you have a table in your HTML with the id "betTable")
        const table = document.getElementById("betTable");

        // Call the createTable function to populate the table with valid bets
        createTable(table, validBets);
      } else {
        console.error("Expected an array of bets, but received:", bets);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Function to create the table
  function createTable(table, data) {
    // Define the columns you want to display in the table
    const columns = ['eventTime', 'teams', 'betTeam', 'agency', 'value', 'odds'];

    // Loop through the data and create a table row for each
    data.forEach(item => {
      const row = table.insertRow();

      // Loop through the columns and create a cell for each
      columns.forEach(column => {
        const cell = row.insertCell();

        // Check if the column is 'eventTime' and apply the date format
        if (column === 'eventTime') {
          cell.textContent = formatDateTime(item[column]);
        } else {
          cell.textContent = item[column];
        }
      });
    });

    // Add click event listeners to each header cell for sorting
    const headerCells = table.rows[0].cells;
    for (let i = 0; i < headerCells.length; i++) {
      headerCells[i].addEventListener('click', () => {
        sortTable(table, i, columns);
      });
    }
  }

  function sortTable(table, column, columns) {
    const rows = Array.from(table.rows).slice(1); // Exclude the header row
    const isDateColumn = columns[column] === 'eventTime';
  
    console.log(`Sorting by column ${column}, isDateColumn: ${isDateColumn}`);
  
    rows.sort((rowA, rowB) => {
      const cellA = isDateColumn ? parseCustomDate(rowA.cells[column].textContent) : rowA.cells[column].textContent;
      const cellB = isDateColumn ? parseCustomDate(rowB.cells[column].textContent) : rowB.cells[column].textContent;
  
      if (isDateColumn) {
        return isAscending ? compareDates(cellA, cellB) : compareDates(cellB, cellA);
      } else {
        // For non-date columns, use simple string comparison
        return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
      }
    });
  
    // Remove existing rows
    rows.forEach(row => table.deleteRow(1)); // Start from the second row (index 1)
  
    // Append sorted rows
    rows.forEach(row => table.appendChild(row));
  
    // Update sorting indicators
    updateSortingIndicator(column);
  }
  
  
  function parseCustomDate(dateString) {
    return moment(dateString, 'MMM D, YYYY [at] h:mm A');
  }
  
  function compareDates(dateA, dateB) {
    return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
  }
  
  function updateSortingIndicator(column) {
    const headerCells = document.querySelectorAll("#betTable th");

    // Remove sorting indicators from other columns
    headerCells.forEach((cell, index) => {
      if (index !== column) {
        cell.classList.remove("ascending", "descending");
      }
    });

    // Toggle sorting indicators for the clicked column
    const clickedCell = headerCells[column];
    if (isAscending) {
      clickedCell.classList.remove("descending");
      clickedCell.classList.add("ascending");
    } else {
      clickedCell.classList.remove("ascending");
      clickedCell.classList.add("descending");
    }

    // Update the current sorted column and sorting order
    currentSortedColumn = column;
    isAscending = !isAscending;
  }

  getValueBets();
});
