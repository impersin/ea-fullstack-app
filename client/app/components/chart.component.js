appModule.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: ['#FF5252', '#FF8A80'],
    responsive: true
  });
    // Configure all line charts
  ChartJsProvider.setOptions('line', {
    showLines: true
  });
}]).component('chartComponent', {
  templateUrl: 'app/templates/chart.html',
  controllerAs: 'chartController',
  controller: function($scope, $http, $location, $timeout, Factory) {
    $scope.toggle = true;
    Factory.getAllPlayer().then(function(res) {
      $scope.players = res.data;
    });
  }
});

