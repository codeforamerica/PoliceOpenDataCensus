 $(document).ready(function() {
     Tabletop.init({
         key: "1lv74SigFdFMJvza_dc2tBVd37r9E4-CPeY9YkRSaBxA",
         callback: showInfo,
         parseNumbers: true
     });
 });

 var allRows = [];

 function showInfo(data, tabletop) {
     allRows = _.sortBy(tabletop.sheets("Completed Data").all(), "City");

     updateCards(allRows);

     updateDepartments(_.chain(allRows)
         .map(
             function(row) {
                 return row["City"]
             }).unique().map(function(city) {
             return {
                 City: city
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

 function updateCards(rows) {
     var source = $("#card-template").html();
     var template = Handlebars.compile(source);

     $.each(rows, function(i, row) {

         var html = template(row);
         $("#cards").append(html);
     })
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
     updateCards(_.filter(allRows, function(row) {
         return row["City"] === department;
     }))
 }

 function filterByDatatype(datatype) {
     clearCards();
     updateCards(_.filter(allRows, function(row) {
         return row["Type of Data"] === datatype;
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