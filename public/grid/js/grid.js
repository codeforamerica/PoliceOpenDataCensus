 $(document).ready(function() {
     Tabletop.init({
         key: "1lv74SigFdFMJvza_dc2tBVd37r9E4-CPeY9YkRSaBxA",
         callback: showInfo,
         parseNumbers: true
     });
 });

 var rawData = [];

 function showInfo(data, tabletop) {

     var departmentTemplate = Handlebars.compile($("#department-template").html());

     rawData = tabletop.sheets("Completed Grid Data").all()
     var allTypes = _.chain(rawData).map(function(row) {
             return row["Type of Data"]
         })
         .unique()
         .value();


     setupDatatypes(allTypes);

     var rows = _.chain(rawData)
         .groupBy("City")
         .map(function(datasets, department) {
             var row = {
                 department: department,
                 departmentHref: URI().filename("").search({
                     "department": department
                 }).toString(),
                 datasets: []
             }

             _.each(allTypes, function(type) {
                 var foundDataset = _.find(datasets, function(dataset) {
                     return dataset["Type of Data"] === type;
                 })
                 if (foundDataset) {
                     row["datasets"].push({
                         free: foundDataset["Data is freely available online"],
                         machine: foundDataset["Data is machine readable"],
                         context: foundDataset["Context is provided"],
                         bulk: foundDataset["Available in bulk"],
                         fresh: foundDataset["Up-to-date"],
                         incident: foundDataset["Incident-level data"],
                         datasetHref: URI().filename("").search({
                             "department": row["department"],
                             "datatype": foundDataset["Type of Data"]
                         }).toString()
                     });
                 } else {
                     row["datasets"].push({
                         free: "DNE",
                         machine: "DNE",
                         context: "DNE",
                         bulk: "DNE",
                         fresh: "DNE",
                         incident: "DNE",
                         datasetHref: "http://goo.gl/forms/WdJHdBmVLQ"
                     });
                 }
             });
             return row;
         })
         .each(function(row) {
             var html = departmentTemplate(row);
             $("#departments").append(html);
         })
         .value();


 }

 function setupDatatypes(allTypes) {
     var datatypes = _.chain(allTypes).map(function(type) {
             return {
                 "datatype": type,
                 "datatypeHref": URI().filename("").search({
                     "datatype": type
                 }).toString()
             }
         })
         .unique()
         .value();
     var datasetTemplate = Handlebars.compile($("#dataset-template").html());
     var datasetHtml = datasetTemplate(datatypes);
     $("#datasets").append(datasetHtml);
 }