angular.module('feevaleApp').factory('$random', function ($rootScope) {
    var random = {};
    // Reseta o gerador de números aleatórios
    random.reset = function() {
        Math.seedrandom($rootScope.random.seed);
    };
    // Obtém um double
    random.getDouble = function() {
        if (!$rootScope.random.enabled) return 0;
        return Math.random();
    };
    // Gera um desvio aleatório
    random.getDesvio = function(desvioPadrao) {
        var randomDeviation = (random.getDouble() * desvioPadrao);
        return (1 - (desvioPadrao / 2)) * randomDeviation;
    };
    // Retorna um ponto de uma função
    random.getFunctionPoint = function (theFunction, x, deviation) {
        var randomDeviation = (random.getDouble() * deviation);
        return theFunction(x) * (1 - (deviation / 2) + randomDeviation);
    };
    // Inicializa o gerador de numeros aleatorios
    random.reset();
    return random;
});
