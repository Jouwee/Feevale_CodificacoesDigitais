angular.module('feevaleApp').factory('$simulador', function ($random, $rootScope) {
    var simulador = {};
    simulador.horasProducaoPorFicha = 8.09;
    simulador.horasProducaoPorCorrecao = 7.05;
    // Gera
    simulador.getTotalHoras = function (ano, mes) {
        // O desvio padrão deveria ser 20%, mas 50% parece mais preciso
        var deviation = 0.5;
        var formula = function (x) {
            return ((Math.abs(Math.sin(x / 4)) * 0.6) + 0.6) * 1300;
        };
        return Math.floor($random.getFunctionPoint(formula, mes, deviation));
    };
    // S
    simulador.getMediaRevisaoPorFicha = function (curvaRevisao) {
        var medias = [];
        var soma = 0;
        for (var i = 0; i < curvaRevisao.length; i++) {
            medias[i] = simulador.horasProducaoPorFicha * (i / 10 + 0.05) * curvaRevisao[i][3];
            soma += isNaN(medias[i]) ? 0 : medias[i];
        }
        return soma;
    };
    // S
    simulador.getMediaCorrecaoPorFicha = function (curvaRevisao) {
        var medias = [];
        var soma = 0;
        for (var i = 0; i < curvaRevisao.length; i++) {
            medias[i] = simulador.horasProducaoPorCorrecao * curvaRevisao[i][3] * (i / 10 + 0.05);
            soma += isNaN(medias[i]) ? 0 : medias[i];
        }
        return soma;
    };
    // Gera a curva do tempo de revisão
    simulador.getCurvaTempoRevisaoFichas = function (pico) {
        var curva = [];
        var soma = 0;
        var numeroItens = pico;
        for (var i = 0; i < numeroItens; i++) {
            curva[i] = (i + 1) / numeroItens;
        }
        var numeroItens = 10 - pico;
        for (var i = 0; i < numeroItens; i++) {
            curva[(pico - i) + numeroItens - 1] = (i + 1) / numeroItens;
        }
        for(var i = 0; i < 10; i++) {
            soma += curva[i];
        }
        for(var i = 0; i < 10; i++) {
            curva[i] = curva[i] / soma;
        }
        // Desvios padrões encontrados:
        // %       Média     DP
        // 0 - 10 :0.29288   0.039184
        // 10- 20 :0.24679   0.022541
        // 20- 30 :0.12762   0.021280
        // 30- 40 :0.10525   0.014604
        // 40- 50 :0.09423   0.013626
        // 50- 60 :0.06250   0.009000
        // 60- 70 :0.04387   0.010907
        // 70- 80 :0.01400   0.000000
        // 80- 90 :0.01350   0.000500
        // 90- 100:-         -
        var desviosPadroes = [0.039184, 0.022541, 0.021280, 0.014604, 0.013626, 0.009000, 0.010907, 0.000000, 0.000500, 0.000000];
        // Aplica os desvios padrões
        for(var i = 0; i < 10; i++) {
            curva[i] = curva[i] + $random.getDesvio(desviosPadroes[i]);
        }
        return curva;
    };
    // Gera a curva de tempo de correção de erros
    simulador.getCurvaTempoCorrecaoFichas = function () {
        // Select dos tempos médios:
        //SELECT X, AVG(Y) FROM (
        //  SELECT FLOOR(X / 10) AS X, AVG(Y) AS Y, PERIODO FROM (
        //    SELECT 'SICLA' AS MODEL, 'Percentual de tempo gasto com correções' AS SERIES, RAZAO_REVISAO AS X, RAZAO_CORRECAO AS Y, PERIODO FROM (
        //      SELECT PERIODO, REV_PROGRAMACAO / TOTPRO * 100 AS RAZAO_REVISAO, HORAS_CORRECAO / TOTPRO * 100 AS RAZAO_CORRECAO
        //         FROM V_FICHAS
        //         ORDER BY PERIODO, HORAS_CORRECAO
        //      )
        //    WHERE RAZAO_REVISAO < 100 AND
        //          RAZAO_CORRECAO < 25 -- Outliers, < 5% dos registros
        //    ORDER BY X
        //  ) GROUP BY PERIODO, FLOOR(X / 10)
        //  ORDER BY X
        //) GROUP BY X
        ///
        
        var curva = [0.24511, 0.10578, 0.04078, 0.03063, 0.02185, 0.01326, 0.01052, 0.00385, 0.00160, 0.00205];
        
//        var desviosPadroes = [0.039184, 0.022541, 0.021280, 0.014604, 0.013626, 0.009000, 0.010907, 0.000000, 0.000500];
//        // Aplica os desvios padrões
//        for(var i = 0; i < 10; i++) {
//            curva[i] = curva[i] + $random.getDesvio(desviosPadroes[i]);
//        }

        // Aplica os desvios padrões
        for(var i = 0; i < 10; i++) {
            curva[i] = curva[i] + $random.getDesvio(0.002);
        }
        return curva;
    };
    // Calcula o número de horas de implementacao e correção no mes
    simulador.getHorasImplementacaoCorrecaoMensal = function (totalHoras, curvaRevisao, curvaCorrecao, mediaImplementacao, mediaCorrecao) {
        var horasProducao = [];
        var totalHorasProducao = 0;
        for (var i = 0; i < curvaRevisao.length; i++) {
            horasProducao[i] = mediaImplementacao * curvaRevisao[i];
            totalHorasProducao += horasProducao[i];
        }
        // Multiplicador de correção
        var fatorCorrecao = 3.47;
        var horasCorrecao = [];
        var totalHorasCorrecao = 0;
        for (var i = 0; i < curvaRevisao.length; i++) {
            horasCorrecao[i] = mediaCorrecao * curvaRevisao[i] * curvaCorrecao[i] * fatorCorrecao;
            totalHorasCorrecao += horasCorrecao[i];
        }
        var totalHorasCalculadas = totalHorasProducao + totalHorasCorrecao;
        return {
            implementacao: (totalHorasProducao / totalHorasCalculadas) * totalHoras,
            correcao: (totalHorasCorrecao / totalHorasCalculadas) * totalHoras
        };
    };
    return simulador;
});
