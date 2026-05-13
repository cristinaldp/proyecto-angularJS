var artista_app = angular.module("miApp", []);

artista_app.controller("ArtistaController", function ($scope, $http) {
    var URL_ARTISTA = "http://localhost:8085/api/artistas";

    $scope.artistas = [];
    $scope.busqueda = "";
    $scope.mensaje = "";
    $scope.cargando = false;

    $scope.cargarAleatorios = function () {
        $scope.cargando = true;
        $scope.mensaje = "";

        $http.get(URL_ARTISTA + "/random", {
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

        $http.get(URL_ARTISTA, {
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

artista_app.controller("loginController", function ($scope, $http) {

    $scope.loginVisible = false;
    $scope.menuPerfilVisible = false;

    $scope.loginData = {
        identificador: "",
        contrasena: ""
    };

    $scope.usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

    $scope.abrirLogin = function () {
        $scope.loginVisible = true;
    };

    $scope.cerrarLogin = function () {
        $scope.loginVisible = false;
    };

    $scope.iniciarSesion = function () {

        $http.post("http://localhost:8085/api/usuarios/login", $scope.loginData)
            .then(function (response) {

                $scope.usuarioActual = response.data;

                localStorage.setItem("usuarioActual", JSON.stringify(response.data));

                $scope.loginVisible = false;

                $scope.loginData = {
                    identificador: "",
                    contrasena: ""
                };

            })
            .catch(function (error) {
                console.error("Error de login:", error);
                alert("Usuario o contraseña incorrectos.");
            });
    };

    $scope.cerrarSesion = function () {
        localStorage.removeItem("usuarioActual");
        $scope.usuarioActual = null;
        $scope.menuPerfilVisible = false;
    };

    $scope.toggleMenuPerfil = function () {
        $scope.menuPerfilVisible = !$scope.menuPerfilVisible;
    };
});
