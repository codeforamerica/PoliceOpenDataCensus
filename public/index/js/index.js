 $(document).ready(function() {
     Tabletop.init({
         key: "1lv74SigFdFMJvza_dc2tBVd37r9E4-CPeY9YkRSaBxA",
         callback: showInfo,
         parseNumbers: true
     });
 });

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

     updateDepartments(_.chain(allRows)
         .map(
             function(row) {
                 return row["Department"]
             }).unique().map(function(department) {
             return {
                 Department: department
             }
         }).value()
     );

     updateTypesOfData(_.chain(allRows)
         .map(
             function(row) {
                 return row["Type of Data"];
             }).unique().map(function(type) {
             return {
                 "Type of Data": type
             }
         }).value())
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
         }).map(function(row) {

             var html = template(row);
             $("#cards").append(html);
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

 function updateDepartments(departments) {
     var source = $("#department-template").html();
     var template = Handlebars.compile(source);

     $.each(departments, function(i, department) {
         var html = template(department);
         $(html).appendTo("#departments");
     })
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

 function updateTypesOfData(types) {
     var source = $("#datatype-template").html();
     var template = Handlebars.compile(source);

     $.each(types, function(i, type) {
         var html = template(type);
         $(html).appendTo("#datatypes");
     })
 }