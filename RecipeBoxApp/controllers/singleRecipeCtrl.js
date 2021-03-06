var app = angular.module('RecipeBoxApp');

app.controller('singleRecipeCtrl', function($scope, $route, getRecipeToView, userService, recipeService, $location, $cookieStore, anchorSmoothScroll){
	$scope.getUsername();
	$scope.tabChange('other');
	 $scope.recipe = getRecipeToView
	
	

	$scope.addRecipe = function(userid){
		if(!userid){
			swal({   title: "Not Logged In",   text: 'Login to add this recipe.',   type: "error",   confirmButtonText: "Ok" });
			//alert("Log in to add this recipe!")
		} else {
			$scope.userRecipes.push($scope.recipe._id);
				var updateUserReqBody = {
					_id : $scope.user._id,
					recipes : $scope.userRecipes
				}
				recipeService.updateUser(updateUserReqBody)
				.then(function(res){
					$route.reload();

			})
		}
		
	}

	$scope.hasRecipe = false;


	 	//you need this so that you can check whether the user has the recipe
	$scope.checkIfHasRecipe = function(){
		if($scope.userRecipes.indexOf($scope.recipe._id) > -1){
			$scope.canDelete = true;
			return $scope.hasRecipe = true;

		} else {
			return $scope.hasRecipe = false;
		}
	}

	$scope.userRecipes = []
	$scope.getUserRecipes = function(){
		recipeService.getUserRecipes($scope.user.facebookId)
		.then(function(res){
			for(var i = 0; i < res.length; i++){
				$scope.userRecipes.push(res[i]._id);
			}
			//console.log($scope.userRecipes);
			$scope.checkIfHasRecipe()
		})
	}

	$scope.getUser = function(){
		if(!$scope.username){
			//console.log("we are ok")
		}else if($scope.username){
			$scope.user = $cookieStore.get('user');
			var uId = $scope.user._id
			$scope.getUserRecipes();
		}
	}
	$scope.getUser();


	$scope.recipeImageShow = function(recipeimage){
		if(recipeimage ===''){
			return true
		} else if (recipeimage === 'none'){
			return false
		} else {
			return true
		}
	}


	
	$scope.checkPermissions = function(permish){
		if(!$scope.user){
			return false
		} else if($scope.user.admin === true){
			return true
		} else if (permish === 'shared'){
			return false
		} else if (permish === $scope.user._id){
			return true
		} else {
			return false
		}
	}


///LOGIC FOR NOTES
	$scope.noteShow = function(){
		if($scope.user && $scope.userRecipes.indexOf($scope.recipe._id) > -1){
			return true;
		} else {
			return false;
		}
	}

	$scope.notes =[];



	$scope.showNotesButton = false;
	$scope.hideNotesButton = false;
	$scope.getUserNotes = function(){
		if($scope.user){
			userService.getUserNotes($scope.user._id)
			.then(function(res){

				for(var i = 0; i < res.length; i++){
					if(res[i].recipeid === $scope.recipe._id){
						$scope.note = res[i];
					}

				}

			})	
		}

	}
	$scope.getUserNotes();

	$scope.hideNotes = function(){
		$scope.showNotesButton = true;
		$scope.hideNotesButton = false;
		$scope.seePublicNotes = false;
	}

	$scope.getRecipeNotes = function(){
		userService.getRecipeNotes($scope.recipe._id)
		.then(function(res){
			for(var i = 0; i < res.length; i++){			
				if(res[i].note.length > 1 && res[i].share === "public"){
					$scope.notes.push(res[i]);		
				}
			}
			$scope.notes.reverse()
			
			if($scope.notes.length){
				$scope.showNotesButton = true;
			}


		})
	}
	$scope.getRecipeNotes();

	$scope.recipeSpinner = false;

	$scope.postNote = function(){
		$scope.recipeSpinner = true;
		if(!$scope.note._id){

			$scope.note = {
				userid: $scope.user._id,
				recipeid: $scope.recipe._id,
				note: $scope.note.note,
				author: $scope.user.userName,
				share: $scope.note.share
			}

			userService.postNote($scope.note)
			.then(function(res){
				$scope.recipeSpinner = false;
				$scope.note = res;
			})
		} else if($scope.note._id){
			userService.editNote($scope.note)
			.then(function(res){
				$scope.recipeSpinner = false;
				$scope.note = res;
			})
		}
	}
	$scope.seePublicNotes = false;
	

	$scope.showPublicNotes = function(){

		$scope.seePublicNotes = true;
		$scope.showNotesButton = false;
		$scope.hideNotesButton = true;
	}
	//TODO: the collections are here so I can remove the recipe from the collections if the user does
	//However, sometime soon, add functionality so the user can just assign the recipe to multiple collections
	$scope.getCollections = function(){
		if($scope.user){
			userService.getCollections($scope.user._id)
			.then(function(res){

				$scope.collections = res;

			})
		}
	}

	$scope.getCollections();

	$scope.updateCollection = function(){
		userService.updateCollection($scope.selectedCollection, $scope.user._id)
		.then(function(res){
			$scope.selectedCollection = ''
		})
	}

	$scope.removeRecipe = function(recipeId){

		var arr = $scope.collections
		for (var i = 0; i < arr.length; i++){
			if(arr[i].recipes.indexOf(recipeId) > -1){
				arr[i].recipes.splice(arr[i].recipes.indexOf(recipeId), 1)
				$scope.selectedCollection = arr[i];
				$scope.updateCollection()
			}
		}

		recipeService.deleteRecipe(recipeId, $scope.user.facebookId);
		$location.path('/home/' + $scope.username)
	}


	$scope.checkForBook = function(page){

		if(page){
			return true
		} else {
			return false
		}
	}




// **********FAVORITES FUNCTIONALITY*************
	
	$scope.checkFavorites = function(recipeid){
		
		if(!$scope.user){
			return false
		}
		//if it's a favorite- return false
		else if($scope.user.favorites.indexOf(recipeid) !== -1){
			return false
		} else {
			return true

		}

	}

	$scope.checkFavorites2 = function(recipeid){
		if(!$scope.user){
			return false
		}
		//if it's a favorite- return false
		else if($scope.user.favorites.indexOf(recipeid) !== -1){
			return true
		} else {
			return false

		}

	}
	
	
	$scope.addToFavorites = function(recipeid){
		
		$scope.user.favorites.push(recipeid);
		var favoritesReqBody = {
			_id : $scope.user._id,
			favorites : $scope.user.favorites
		}
		recipeService.updateUser(favoritesReqBody)
		.then(function(res){
			//console.log($scope.user);
		})
	}

	$scope.unfavorite = function(recipeid){
		var arr = $scope.user.favorites;
		//console.log(recipeid)
		//console.log(arr)
		for(var i = 0; i < arr.length; i++){
			if(arr[i] === recipeid){
				arr.splice(i,1)
				break;
			}
			//
			//
			}
		
		//debugger;
		recipeService.updateUser($scope.user)
		.then(function(res){
			$scope.getRecipes();
		})
	}
	


})