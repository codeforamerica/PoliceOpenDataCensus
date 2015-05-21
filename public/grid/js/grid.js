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
                 departmentHref: URI().filename("datasets.html").search({
                     "department": department
                 }).toString(),
                 datasets: []
             }

             _.each(allTypes, function(type) {
                 var foundDataset = _.find(datasets, function(dataset) {
                     return dataset["Type of Data"] === type;
                 })
                 if (foundDataset) {
                     var gridData = {
                         free: foundDataset["Data is freely available online"],

                         machine: foundDataset["Data is machine readable"],

                         context: foundDataset["Context is provided"],

                         bulk: foundDataset["Available in bulk"],

                         fresh: foundDataset["Up-to-date"],

                         incident: foundDataset["Incident-level data"],

                         datasetHref: URI().filename("datasets.html").search({
                             "department": row["department"],
                             "datatype": foundDataset["Type of Data"]
                         })
                     }

                     gridData.freeCaption = captions.free[gridData.free];
                     gridData.machineCaption = captions.machine[gridData.machine];
                     gridData.contextCaption = captions.context[gridData.context];
                     gridData.bulkCaption = captions.bulk[gridData.bulk];
                     gridData.freshCaption = captions.fresh[gridData.fresh];
                     gridData.incidentCaption = captions.incident[gridData.incident];
                     row["datasets"].push(gridData).toString()
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

     $('[data-toggle="tooltip"]').tooltip()
 }




 function setupDatatypes(allTypes) {
     var datatypes = _.chain(allTypes).map(function(type) {
             return {
                 "datatype": type,
                 "datatypeHref": URI().filename(type.replace(/ /g, '') + ".html").toString()
             }
         })
         .unique()
         .value();
     var datasetTemplate = Handlebars.compile($("#dataset-template").html());
     var datasetHtml = datasetTemplate(datatypes);
     $("#datasets").append(datasetHtml);
 }