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
  controller: function($scope, $http, $location, $timeout) {
    $scope.toggle = true;
    $scope.labels = ['Pace', 'Dribbling', 'Shooting', 'Defending', 'Passing', 'Physicality'];
    // $scope.series = ['Series A', 'Series B'];
    $scope.data = [
    [98, 98, 99, 50, 92, 94]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    
  }
});

