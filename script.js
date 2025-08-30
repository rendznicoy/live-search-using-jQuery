let allEmployees = [];
let filteredEmployees = [];
let currentPage = 1;
const itemsPerPage = 5;

$(document).ready(function () {
  // Load data from JSON file
  $.getJSON("data.json", function (data) {
    allEmployees = data;
    performSearch();
    createPagination();
  }).fail(function () {
    $("#results").html(`
                    <div class="no-results">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h4>Unable to load employee data</h4>
                        <p>Please make sure the data.json file exists and is accessible</p>
                    </div>
                `);
  });

  // Event listeners
  $("#globalSearch").on("input", function () {
    currentPage = 1;
    performSearch();
  });
  $("#searchField, #statusFilter, #genderFilter, #ageMin, #ageMax, #sortBy").on(
    "change",
    function () {
      currentPage = 1;
      performSearch();
    }
  );
});

function toggleFilters() {
  const filterSection = $("#filterSection");
  const isVisible = filterSection.is(":visible");

  if (isVisible) {
    filterSection.slideUp();
  } else {
    filterSection.slideDown();
  }
}

function clearAllFilters() {
  currentPage = 1;
  $("#globalSearch").val("");
  $("#searchField").val("all");
  $("#statusFilter").val("");
  $("#genderFilter").val("");
  $("#ageMin").val("");
  $("#ageMax").val("");
  $("#sortBy").val("name");
  $("#clearBtn").hide();
  performSearch();
}

function performSearch() {
  displayResults();
  createPagination();
  const searchTerm = $("#globalSearch").val().toLowerCase();
  const searchField = $("#searchField").val();
  const statusFilter = $("#statusFilter").val();
  const genderFilter = $("#genderFilter").val();
  const ageMin = parseInt($("#ageMin").val()) || 0;
  const ageMax = parseInt($("#ageMax").val()) || 999;
  const sortBy = $("#sortBy").val();

  // Show/hide clear button
  const hasFilters =
    searchTerm ||
    statusFilter ||
    genderFilter ||
    $("#ageMin").val() ||
    $("#ageMax").val();
  $("#clearBtn").toggle(hasFilters);

  // Filter employees
  filteredEmployees = allEmployees.filter((employee) => {
    // Text search
    if (searchTerm) {
      let searchMatch = false;

      switch (searchField) {
        case "name":
          searchMatch = employee.name.toLowerCase().includes(searchTerm);
          break;
        case "job_title":
          searchMatch = employee.job_title.toLowerCase().includes(searchTerm);
          break;
        case "company":
          searchMatch = employee.company.toLowerCase().includes(searchTerm);
          break;
        case "location":
          searchMatch = employee.location.toLowerCase().includes(searchTerm);
          break;
        case "skills":
          searchMatch = employee.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm)
          );
          break;
        case "bio":
          searchMatch = employee.bio.toLowerCase().includes(searchTerm);
          break;
        default: // 'all'
          searchMatch =
            employee.name.toLowerCase().includes(searchTerm) ||
            employee.job_title.toLowerCase().includes(searchTerm) ||
            employee.company.toLowerCase().includes(searchTerm) ||
            employee.location.toLowerCase().includes(searchTerm) ||
            employee.bio.toLowerCase().includes(searchTerm) ||
            employee.skills.some((skill) =>
              skill.toLowerCase().includes(searchTerm)
            ) ||
            employee.interests.some((interest) =>
              interest.toLowerCase().includes(searchTerm)
            );
      }

      if (!searchMatch) return false;
    }

    // Status filter
    if (statusFilter && employee.status !== statusFilter) return false;

    // Gender filter
    if (genderFilter && employee.gender !== genderFilter) return false;

    // Age filter
    if (employee.age < ageMin || employee.age > ageMax) return false;

    return true;
  });

  // Sort employees
  filteredEmployees.sort((a, b) => {
    switch (sortBy) {
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "age":
        return a.age - b.age;
      case "age_desc":
        return b.age - a.age;
      case "job_title":
        return a.job_title.localeCompare(b.job_title);
      default: // 'name'
        return a.name.localeCompare(b.name);
    }
  });

  displayResults();
}

function displayResults() {
  const resultsContainer = $("#results");
  const resultsCount = $("#resultsCount");
  const paginationContainer = $("#paginationContainer");

  if (filteredEmployees.length === 0) {
    resultsContainer.html(`
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h4>No employees found</h4>
                <p>Try adjusting your search criteria or filters</p>
            </div>
        `);
    resultsCount.hide();
    paginationContainer.hide();
    return;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Show results count with pagination info
  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, filteredEmployees.length);
  resultsCount.show().html(`
        Found ${filteredEmployees.length} employee${
    filteredEmployees.length !== 1 ? "s" : ""
  } 
        <span class="text-muted">| Showing ${startItem}-${endItem}</span>
    `);

  let html = "";
  currentEmployees.forEach((employee) => {
    html += createEmployeeCard(employee);
  });

  resultsContainer.html(html);
}

function createEmployeeCard(employee) {
  const skillsHtml = employee.skills
    .map((skill) => `<span class="skill-tag">${skill}</span>`)
    .join("");

  const interestsHtml = employee.interests
    .map((interest) => `<span class="interest-tag">${interest}</span>`)
    .join("");

  const languagesHtml = employee.languages.join(", ");

  return `
                <div class="employee-card">
                    <div class="employee-header">
                        <img src="${employee.image}" alt="${
    employee.name
  }" class="employee-image">
                        <div class="employee-info">
                            <h5>${employee.name}</h5>
                            <p><i class="fas fa-briefcase"></i> ${
                              employee.job_title
                            }</p>
                            <span class="status-badge status-${employee.status.toLowerCase()}">${
    employee.status
  }</span>
                        </div>
                    </div>
                    
                    <div class="employee-details">
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-building"></i> Company</span>
                            ${employee.company}
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Location</span>
                            ${employee.location}
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-birthday-cake"></i> Age</span>
                            ${employee.age} years old
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-venus-mars"></i> Gender</span>
                            ${employee.gender}
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-language"></i> Languages</span>
                            ${languagesHtml}
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-user"></i> Bio</span>
                        ${employee.bio}
                    </div>
                    
                    <div class="skills-container">
                        <span class="detail-label"><i class="fas fa-cogs"></i> Skills</span>
                        <div>${skillsHtml}</div>
                    </div>
                    
                    <div class="interests-container">
                        <span class="detail-label"><i class="fas fa-heart"></i> Interests</span>
                        <div>${interestsHtml}</div>
                    </div>
                </div>
            `;
}

function goToPage(page) {
  currentPage = page;
  displayResults();
  createPagination();
}

function createPagination() {
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginationContainer = $("#paginationContainer");
  const pagination = $("#pagination");

  if (filteredEmployees.length === 0 || totalPages <= 1) {
    paginationContainer.hide();
    return;
  }

  paginationContainer.show();
  pagination.empty();

  // Previous button
  pagination.append(`
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="${
              currentPage > 1 ? `goToPage(${currentPage - 1})` : "return false"
            }" aria-label="Previous">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `);

  // Page numbers
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    pagination.append(
      `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(1)">1</a></li>`
    );
    if (startPage > 2) {
      pagination.append(
        `<li class="page-item disabled"><span class="page-link">...</span></li>`
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.append(`
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
            </li>
        `);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pagination.append(
        `<li class="page-item disabled"><span class="page-link">...</span></li>`
      );
    }
    pagination.append(
      `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(${totalPages})">${totalPages}</a></li>`
    );
  }

  // Next button
  pagination.append(`
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="${
              currentPage < totalPages
                ? `goToPage(${currentPage + 1})`
                : "return false"
            }" aria-label="Next">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `);
}
