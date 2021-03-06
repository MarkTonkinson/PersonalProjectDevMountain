var app = angular.module('RecipeBoxApp');

app.service('searchService', function($http, $q){
	
	this.search = function(searchText, userid){
		//console.log('service has search text ', searchText)
		//console.log('userid ', userid)
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/' + userid + '/search/' + searchText
		}).then(function(recipes){

			deferred.resolve(recipes);
		})
		return deferred.promise
	}

	this.searchLocation = function(searchText, userid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/' + userid + '/searchLocation/' + searchText
		}).then(function(recipes){
			deferred.resolve(recipes);
		})
		return deferred.promise;
	}

	this.searchAuthor = function(searchText, userid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/' + userid + '/searchAuthor/' + searchText
		}).then(function(recipes){
			deferred.resolve(recipes);
		})
		return deferred.promise;
	}

	this.searchRecipeName = function(searchText, userid){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/' + userid + '/searchRecipeName/' + searchText
		}).then(function(recipes){
			deferred.resolve(recipes);
		})
		return deferred.promise;
	}

	this.findUsers = function(searchText){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/api/findUsers/' + searchText
		}).then(function(users){
			deferred.resolve(users.data);
		})
		return deferred.promise;
	}
})