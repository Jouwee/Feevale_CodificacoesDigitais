angular.module('feevaleApp').factory('$random', function ($rootScope) {
    var random = {};
    // Reseta o gerador de números aleatórios
    random.reset = function() {
        Math.seedrandom($rootScope.random.seed);
    };
    // Obtém um double
    random.getDouble = function() {
        return Math.random();
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
