<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="js/jquery-2.1.3.min.js"></script>
        <script src="js/highcharts.js"></script>
        <link rel="stylesheet" href="css/default.css" />
        <script>
            $(function () {
                var data = <%= request.getAttribute("result")%>;
                var theData = [];
                for(var i in data) {
                    console.log(data[i]);
                    theData.push({name: data[i][0], y:parseInt(data[i][1])});
                }
                console.log(theData);
                $('#container').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Monthly Average Rainfall'
                    },
                    series: [{
                        name: 'Tokyo',
                        data: theData

                    }]
                });
            });
        </script>
    </head>
    <body>
        <div>
            <div id="container"></div>
        </div>
        <div>
            <form action="." method="POST">
                <textarea class="query" name="query"><%= request.getAttribute("query")%></textarea>
                <input type="submit" />
            </form>
        </div>
        <%= request.getAttribute("exception")%>
    </body>
</html>
