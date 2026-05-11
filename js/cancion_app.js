var cancion_app = angular.module("miApp", []);

cancion_app.controller("CancionController", function ($scope, $http) {
    var URL_API = "http://localhost:8085/api/canciones";

    $scope.canciones = [];
    $scope.busqueda = "";
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarAleatorias = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API + "/random", {
            params: { limit: 6 }
        })
        .then(function (response) {
            $scope.canciones = response.data;
            if ($scope.canciones.length === 0) {
                $scope.mensaje = "No se han encontrado canciones aleatorias.";
            }
        })
        .catch(function (error) {
            console.error("Error al cargar canciones aleatorias:", error);
            $scope.canciones = [];
            $scope.mensaje = "Error al cargar las canciones.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.buscarCanciones = function () {
        if (!$scope.busqueda || $scope.busqueda.trim() === "") {
            $scope.mensaje = "Introduce el nombre de la canción que quieras buscar.";
            $scope.canciones = [];
            return;
        }

        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API, {
            params: {
                titulo: $scope.busqueda,
                limit: 20,
                page: 0
            }
        })
        .then(function (response) {
            $scope.canciones = response.data;

            if ($scope.canciones.length === 0) {
                $scope.mensaje = "No se encontraron canciones con ese nombre.";
            }
        })
        .catch(function (error) {
            console.error("Error al buscar canciones:", error);
            $scope.canciones = [];
            $scope.mensaje = "Error al realizar la búsqueda.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.abrirVideo = function (cancion) {
        if (cancion.url) {
            window.open(cancion.url, "_blank");
        } else {
            $scope.mensaje = "Esta canción no tiene vídeo disponible.";
        }
    };

    $scope.cargarTopCanciones = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API + "/top", {
            params: {
                limit: 5
            }
        })
        .then(function (response) {
            $scope.canciones = response.data;

            if ($scope.canciones.length === 0) {
                $scope.mensaje = "No se encontraron canciones en el top global.";
            }
        })
        .catch(function (error) {
            console.error("Error al cargar el top global:", error);
            $scope.canciones = [];
            $scope.mensaje = "Error al cargar el top global.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };
});