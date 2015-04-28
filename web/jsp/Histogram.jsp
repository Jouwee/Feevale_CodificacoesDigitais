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
                
                var criaGraficoColunas = function(id, data, titulo, tituloX, tituloY, serie) {
                    var theData = [];
                    for(var i in data) {
                        theData.push({name: data[i][0], y:parseInt(data[i][1])});
                    }
                    $(id).highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: titulo
                        },
                        xAxis: {
                            type: 'category',
                            title: {
                                text: tituloX
                            }
                        },
                        yAxis: {
                            title: {
                                text: tituloY
                            }
                        },
                        series: [{
                            name: serie,
                            data: theData

                        }]
                    });
                };
                criaGraficoColunas(
                        '#errosPorMes',
                        <%= request.getAttribute("errosPorMes")%>, 
                        'Erros por mês',
                        'Período',
                        'Número de erros',
                        'Erros por mês'
                    );
                criaGraficoColunas(
                        '#revisaoVsNumeroErros',
                        <%= request.getAttribute("revisaoVsNumeroErros")%>, 
                        'Número de erros a partir do % de tempo de revisão desde 01/2013. Agrupado a cada 400 fichas',
                        'Percentual de revisão (Revisão / produção)',
                        'Número de erros',
                        'Número de erros gerados pelas fichas'
                    );
            });
        </script>
    </head>
    <body>
        <div>
            <div id="errosPorMes"></div>
            <div id="revisaoVsNumeroErros"></div>
        </div>
        <%= request.getAttribute("exception")%>
    </body>
</html>
