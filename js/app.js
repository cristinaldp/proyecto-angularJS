var app = angular.module("miApp", []);

app.controller("ArtistaController", function ($scope, $http) {
    var URL_API = "http://localhost:8085/api/artistas";

    $scope.artistas = [];
    $scope.busqueda = "";
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarAleatorios = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API + "/random", {
            params: { limit: 6 }
        })
        .then(function (response) {
            $scope.artistas = response.data;
            if ($scope.artistas.length === 0) {
                $scope.mensaje = "No se han encontrado artistas aleatorios.";
            }
        })
        .catch(function (error) {
            console.error("Error al cargar artistas aleatorios:", error);
            $scope.artistas = [];
            $scope.mensaje = "Error al cargar los artistas.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.buscarArtistas = function () {
        if (!$scope.busqueda || $scope.busqueda.trim() === "") {
            $scope.mensaje = "Introduce el nombre del artista que quieras buscar.";
            $scope.artistas = [];
            return;
        }

        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API, {
            params: {
                nombre: $scope.busqueda,
                limit: 20,
                page: 0
            }
        })
        .then(function (response) {
            $scope.artistas = response.data;

            if ($scope.artistas.length === 0) {
                $scope.mensaje = "No se encontraron artistas con ese nombre.";
            }
        })
        .catch(function (error) {
            console.error("Error al buscar artistas:", error);
            $scope.artistas = [];
            $scope.mensaje = "Error al realizar la búsqueda.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };

    $scope.verArtista = function (id) {
        window.location.href = "infoArtista.html?id=" + id;
    };
});


app.controller("DetalleArtistaController", function ($scope, $http) {
    var URL_API = "http://localhost:8085/api/artistas";

    $scope.artista = null;
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarDetalle = function () {
        var params = new URLSearchParams(window.location.search);
        var id = params.get("id");

        if (!id) {
            $scope.mensaje = "No se ha indicado el id del artista.";
            return;
        }

        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_API + "/" + id)
        .then(function (response) {
            $scope.artista = response.data;
        })
        .catch(function (error) {
            console.error("Error al cargar el detalle del artista:", error);
            $scope.mensaje = "No se pudo cargar la información del artista.";
        })
        .finally(function () {
            $scope.cargando = false;
        });
    };
});