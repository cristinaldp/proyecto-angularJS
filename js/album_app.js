var album_app = angular.module("miApp", []);

album_app.controller("AlbumController", function ($scope, $http) {
    var URL_ALBUMES = "http://localhost:8085/api/albumes";

    $scope.albumes = [];
    $scope.busqueda = "";
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarAleatorios = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_ALBUMES + "/random", {
            params: { limit: 6 }
        })
        .then(function (response) {
            $scope.albumes = response.data;
            if ($scope.albumes.length === 0) {
                $scope.mensaje = "No se han encontrado albumes aleatorios.";
            }
        })
        .catch(function (error) {
            console.error("Error al cargar albumes aleatorios:", error);
            $scope.albumes = [];
            $scope.mensaje = "Error al cargar los albumes.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.buscarAlbumes = function () {
        if (!$scope.busqueda || $scope.busqueda.trim() === "") {
            $scope.mensaje = "Introduce el nombre del album que quieras buscar.";
            $scope.albumes = [];
            return;
        }

        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_ALBUMES, {
            params: {
                nombre: $scope.busqueda,
                limit: 20,
                page: 0
            }
        })
        .then(function (response) {
            $scope.albumes = response.data;

            if ($scope.albumes.length === 0) {
                $scope.mensaje = "No se encontraron albumes con ese nombre.";
            }
        })
        .catch(function (error) {
            console.error("Error al buscar albumes:", error);
            $scope.albumes = [];
            $scope.mensaje = "Error al realizar la búsqueda.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.verArtista = function (idArtista) {
        window.location.href = "infoArtista.html?id=" + idArtista;
    };

    $scope.cargarNovedades = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_ALBUMES + "/novedades", {
            params: {
                limit: 6
            }
        })
        .then(function (response) {
            $scope.albumes = response.data;

            if ($scope.albumes.length === 0) {
                $scope.mensaje = "No se han encontrado novedades.";
            }
        })
        .catch(function (error) {
            console.error("Error al cargar novedades:", error);
            $scope.albumes = [];
            $scope.mensaje = "Error al cargar las novedades.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

});