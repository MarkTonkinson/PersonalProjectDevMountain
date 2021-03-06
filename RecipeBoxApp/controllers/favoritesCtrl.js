var app = angular.module('RecipeBoxApp');

app.controller('favoritesCtrl', function($scope, $location, recipeService, $cookieStore){
	$scope.getUsername();
	$scope.tabChange('fav');
	$scope.user = $cookieStore.get('user');
	//console.log($scope.user.favorites)

	$scope.getRecipes = function(){
		recipeService.getUserRecipes($scope.user.facebookId)
		.then(function(res){
			$scope.recipes = []
			for(var i = 0; i < res.length; i++){
				if($scope.user.favorites.indexOf(res[i]._id) !== -1){
					$scope.recipes.push(res[i]);
				}
			}
		})
	}
	$scope.getRecipes();
	
	$scope.recipeImageShow = function(recipeimage){
		if(recipeimage ===''){
			return true
		} else if (recipeimage === 'none'){
			return false
		} else {
			return true
		}
	}

	$scope.unfavorite = function(recipeid){
		var arr = $scope.user.favorites;
		
		for(var i = 0; i < arr.length; i++){
			if(arr[i] === recipeid){
				arr.splice(i,1)
				break;
			}
		}
		var unfavoriteReqBody = {
			_id : $scope.user._id,
			favorites : $scope.user.favorites
		}
		
		recipeService.updateUser(unfavoriteReqBody)
		.then(function(res){
			$scope.getRecipes();
		})
	}

	$scope.checkPermissions = function(permish){
		if ($scope.user.admin === true){
			return true
		} else if (permish === 'shared'){
			return false
		} else if (permish === $scope.user._id){
			return true
		} else {
			return false
		}
	}
		
})