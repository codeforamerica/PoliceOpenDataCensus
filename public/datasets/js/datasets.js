 $(document).ready(function() {
     Tabletop.init({
         key: "1lv74SigFdFMJvza_dc2tBVd37r9E4-CPeY9YkRSaBxA",
         callback: showInfo,
         parseNumbers: true
     });
 });

 var captions = {
     "free": {
         "Yes": "The data is available online",
         "No": "The data is not available online",
         "Unsure": "It is unclear whether the data is available online"
     },

     "machine": {
         "Yes": "It's machine readable",
         "No": "It is not machine readable",
         "Unsure": "It is unclear whether the data is machine readable"
     },

     "context": {
         "Yes": "Context is provided",
         "No": "Context is not provided ",
         "Unsure": "It is unclear whether the contect is provided"
     },

     "bulk": {
         "Yes": "Data can be downloaded in bulk ",
         "No": "Data cannot be downloaded in bulk  ",
         "Unsure": "It is unclear whether the data can be downloaded in bulk"
     },

     "fresh": {
         "Yes": "Data is up-to-date",
         "No": "Data is not up-to-date ",
         "Unsure": "It is unclear whether the data is up-to-date"
     },

     "incident": {
         "Yes": "Data shows individual incidents ",
         "No": "Data does not show individual incidents",
         "Unsure": "It is unclear whether the data shows individual incidents"
     }
 };

 var allRows = [];

 function showInfo(data, tabletop) {
     allRows = _.sortBy(tabletop.sheets("Completed Detailed Data").all(), "Department");

     var uri = new URI();
     var params = uri.search(true);

     if (params) {
         var filters = [];
         filters.push(buildDepartmentFilter(params["department"]));
         filters.push(buildDatatypeFilter(params["datatype"]));
         updateCards(allRows, _.compact(filters));
     } else {
         updateCards(allRows);
     }
 }

 function updateCards(rows, filters) {
     var filters = filters || [];
     var source = $("#card-template").html();
     var template = Handlebars.compile(source);

     _.chain(rows)
         .filter(function(row) {
                 return _.all(filters, function(filter) {
                     return filter(row);
                 });
        })
         .map(function(row) {

            row.free = row["Data is freely available online"];
            row.machine = row["Data is machine readable"];
            row.context = row["Context is provided"];
            row.bulk = row["Available in bulk"];
            row.fresh = row["Up-to-date"];
            row.incident = row["Incident-level data"];
                 

             row.freeCaption = captions.free[row.free];
             row.machineCaption = captions.machine[row.machine];
             row.contextCaption = captions.context[row.context];
             row.bulkCaption = captions.bulk[row.bulk];
             row.freshCaption = captions.fresh[row.fresh];
             row.incidentCaption = captions.incident[row.incident];

             var html = template(row);
            $("#cards").append(html);
            $('[data-toggle="tooltip"]').tooltip();  
        });
 }




 function buildDepartmentFilter(department) {
     if (!department) {
         return false;
     }
     return function(row) {
         return row["Department"] === department;
     }
 }

 function buildDatatypeFilter(datatype) {
     if (!datatype) {
         return false;
     }
     return function(row) {
         return row["Type of Data"] === datatype;
     }
 }

 function clearCards() {
     $("#cards").empty();
 }

 function filterByDepartment(department) {
     clearCards();
     updateCards(allRows, [buildDepartmentFilter(department)]);
 }

 function resetSearch() {
     clearCards();
     updateCards(allRows);
 }

 function filterByDatatype(datatype) {
     clearCards();
     updateCards(allRows, [buildDatatypeFilter(datatype)]);
 }

 function filterByMachineReadable(machineReadable) {
     clearCards();
     updateCards(_.filter(allRows, function(row) {
         return machineReadable ? row["Data is machine readable"] === "Yes" : row["Data is machine readable"] === "No";
     }))
 }