 $(document).ready(function() {
     Tabletop.init({
         key: "177LptTs3sQI7JLMD5Js77v7jQyVw3g8NIu1U3JQMcpQ",
         callback: showInfo,
         parseNumbers: true
     });
 });

 var allRows = [];

 function showInfo(data, tabletop) {
     allRows = tabletop.sheets("Sheet1").all();
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
                 return row["Type of Data"]
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
         $("#departments").append(html);
     })
 }

 function updateTypesOfData(types) {
     var source = $("#datatype-template").html();
     var template = Handlebars.compile(source);

     $.each(types, function(i, type) {
         var html = template(type);
         $("#datatypes").append(html);
     })
 }